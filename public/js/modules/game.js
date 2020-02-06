class Game {
	constructor(w, h, bg, tanks, bullets = [], blocks = []) {
		this.w = w
		this.h = h
		this.bg = bg
		this.tanks = tanks
		this.bullets = bullets
		this.blocks = blocks
		this.timer = 0
	}

	limitArea() {
		this.tanks.forEach((item, i, array) => {
			const itemCords = item.getData().slice(2)
			let x = itemCords[0]
			let y = itemCords[1]

			if (y >= this.h - item.size) {
				y = this.h - item.size
				item.setCords(x, y)
			} else if (y <= 0) {
				y = 0
				item.setCords(x, y)
			}

			if (x >= this.w - item.size) {
				x = this.w - item.size
				item.setCords(x, y)
			} else if (x <= 0) {
				x = 0
				item.setCords(x, y)
			}
		})
	}

	drawAll(context, tanksSprites, bulletsSprites, blocksSprites = undefined) {
		this.limitArea()

		this.tanks.forEach((tank, i, tanks) => {
			const tankSpriteCords = tank.getData().slice(0, 2)
			const tankCords = tank.getData().slice(2)
			tanksSprites.drawSprite(context, tankSpriteCords, tankCords)
			tank.limitBullets(this.w, this.h)
			tank.getBullets().forEach((bullet, j, bullets) => {
				bulletsSprites.drawSprite(context, [0, 0], bullet.getCords())
			})
		})
		this.tanks.forEach((tank, i, tanks) => {
			tank.moveBullets()
		})
		this.updateTimer()
	}

	clearAll(context) {
		context.fillStyle = this.bg
		context.fillRect(0, 0, this.w, this.h)
	}

	updateTimer() {
		this.timer++
	}

	watchKeyBoard() {
		onkeydown = e => {
			if (e.key === 'ArrowUp') {
				this.userRotate(0)
				this.userMove(0)
			} else if (e.key === 'ArrowDown') {
				this.userRotate(2)
				this.userMove(2)
			} else if (e.key === 'ArrowRight') {
				this.userRotate(1)
				this.userMove(1)
			} else if (e.key === 'ArrowLeft') {
				this.userRotate(3)
				this.userMove(3)
			} else if (e.key === ' ') {
				if (
					this.timer - this.tanks[0].lastFireTime >
					this.tanks[0].fireDelay
				) {
					this.tanks[0].lastFireTime = this.timer
					this.tanks[0].fire()
				}
			}
		}
	}

	userRotate(direction) {
		this.tanks[0].rotate(direction)
	}

	userMove(direction) {
		this.tanks[0].lastX = this.tanks[0].x
		this.tanks[0].lastY = this.tanks[0].y
		this.tanks[0].move(direction)
	}

	checkTanksCollisions() {
		const len = this.tanks.length
		const tanks = this.tanks
		const size = tanks[0].size
		const checked = []

		for (let i = 0; i < len; i++) {
			for (let j = 0; j < len; j++) {
				if (i == j) continue
				if (
					checked.includes(i + '' + j) ||
					checked.includes(j + '' + i)
				)
					continue

				const iC = tanks[i].getCenter()
				const jC = tanks[j].getCenter()

				const dX = iC[0] - jC[0]
				const dY = iC[1] - jC[1]

				if (Math.abs(dX) <= size && Math.abs(dY) <= size) {
					tanks[i].x = tanks[i].lastX
					tanks[i].y = tanks[i].lastY
				}

				checked.push(i + '' + j)
			}
		}
	}

	checkBulletsCollisions() {
		const tanks = this.tanks
		const len = tanks.length
		const userBullets = tanks[0].bullets
		const tankSize = tanks[0].size
		userBullets.forEach((bullet, i, bullets) => {
			tanks.slice(1).forEach((tank, j, tanks) => {
				const tankC = tank.getCenter()
				const bulletC = bullet.getCenter()

				const dX = tankC[0] - bulletC[0]
				const dY = tankC[1] - bulletC[1]
				if (
					Math.abs(dX) <= tankSize / 2 + bullet.size / 2 &&
					Math.abs(dY) <= tankSize / 2 + bullet.size / 2
				) {
					bullets.splice(i, 1)
					tank.getDamage(bullet.damage)
					console.log('Блять попал')
				}
			})
		})
		this.tanks = this.tanks.filter(tank => tank.hp > 0)
	}

	checkCollisions() {
		this.checkTanksCollisions()
		this.checkBulletsCollisions()
	}

	enemyBrain() {
		const userTank = this.tanks[0]
		const tankSize = this.tanks[0].size
		const enemyTanks = this.tanks.slice(1)
		enemyTanks.forEach( (eTank, i, eTanks) => {

			const userCords = userTank.getCenter()
			const userX = userCords[0]
			const userY = userCords[1]

			const eCords = eTank.getCenter()
			const eX = eCords[0]
			const eY = eCords[1]

			const randDirection = Math.random().toFixed(1)
			// eTank.move(eTank.direction)
			// if (randDirection > 0.89) {
			// 	eTank.move(eTank.direction)
			// } else {
			// 	eTank.direction = Math.round((Math.random()*3))
			// 	// eTank.move(eTank.direction)
			// }

			if (Math.abs(userX - eX) <= tankSize ) {
				if (
					this.timer - eTank.lastFireTime >
					eTank.fireDelay
				) {
					eTank.lastFireTime = this.timer
					eTank.fire()
				}
			}
		})
	}
}

export default Game
