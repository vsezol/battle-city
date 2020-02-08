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
				if (i != 0) {
					const rotates = [0, 1, 3]
					const rd = rotates[Math.round(Math.random() * 2)]
					item.rotate(rd)
					item.setTarget(item.randomDistance())
				}
			} else if (y <= 0) {
				y = 0
				item.setCords(x, y)
				if (i != 0) {
					const rotates = [2, 1, 3]
					const rd = rotates[Math.round(Math.random() * 2)]
					item.rotate(rd)
					item.setTarget(item.randomDistance())
				}
			}
			if (x >= this.w - item.size) {
				x = this.w - item.size
				item.setCords(x, y)
				if (i != 0) {
					const rotates = [0, 2, 3]
					const rd = rotates[Math.round(Math.random() * 2)]
					item.rotate(rd)
					item.setTarget(item.randomDistance())
				}
			} else if (x <= 0) {
				x = 0
				item.setCords(x, y)
				if (i != 0) {
					const rotates = [0, 1, 2]
					const rd = rotates[Math.round(Math.random() * 2)]
					item.rotate(rd)
					item.setTarget(item.randomDistance())
				}
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
		const tanks = this.tanks
		tanks.forEach((tank, i, tanks) => {
			tank.checkDirection([...tanks.slice(0, i), ...tanks.slice(i + 1)])
		})
	}

	checkBulletsCollisions() {
		const tanks = this.tanks
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
				}
			})
		})

		tanks.slice(1).forEach((atacker, i) => {
			tanks.forEach((target, j) => {
				atacker.bullets.forEach((bullet, j, bullets) => {
					const tC = target.getCenter()
					const bC = bullet.getCenter()

					const dX = tC[0] - bC[0]
					const dY = tC[1] - bC[1]

					if (
						Math.abs(dX) <= tankSize / 2 + bullet.size / 2 &&
						Math.abs(dY) <= tankSize / 2 + bullet.size / 2 &&
						atacker.id != target.id
					) {
						bullets.splice(j, 1)
						target.getDamage(bullet.damage)
					}
				})
			})
		})

		const allBullets = tanks.map(i => i.bullets)
		allBullets.forEach((bullets1, i) => {
			bullets1.forEach((b1, j) => {
				allBullets.forEach((bullets2, z) => {
					bullets2.forEach((b2, v) => {
						if (b1.id !== b2.id) {
							const b1C = b1.getCenter()
							const b2C = b2.getCenter()
							const dX = b1C[0] - b2C[0]
							const dY = b1C[1] - b2C[1]
							if (
								Math.abs(dX) <= b1.size &&
								Math.abs(dY) <= b1.size
							) {
								bullets1.splice(i, 1)
								bullets2.splice(v, 1)
							}
						}
					})
				})
			})
		})

		if (this.tanks[0].hp <= 0) {
			alert('you died')
			location.reload()
		}
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
		let iter = 0
		enemyTanks.forEach((eTank, i, eTanks) => {
			const userCords = userTank.getCenter()
			const userX = userCords[0]
			const userY = userCords[1]

			const eCords = eTank.getCenter()
			const eX = eCords[0]
			const eY = eCords[1]

			const goToKill = eTank.findTankOnDirection(userTank)
			if (goToKill) {
				eTank.rotate(eTank.direction)
				eTank.setTarget(goToKill[1])
			}
			if (eTank.isCompleteTarget() == true) {
					eTank.rotate(eTank.randomRotate())
					eTank.setTarget(eTank.randomDistance())
			} else if (eTank.isCompleteTarget() === 'no target') {
				eTank.rotate(eTank.randomRotate())
				eTank.setTarget(eTank.randomDistance())
			} else {
				eTank.move(eTank.direction)
			}

			const friends = [...eTanks]
			friends.splice(i, 1)
			if (eTank.findFriendOnDirection(friends) === undefined) {
				if (
					this.timer - eTank.lastFireTime > eTank.fireDelay &&
					eTank.findTankOnDirection(userTank)
				) {
					eTank.lastFireTime = this.timer
					eTank.fire()
				}
			} else {
				eTank.rotate(eTank.randomRotate())
				eTank.setTarget(eTank.randomDistance())
			}
		})
	}
}

export default Game
