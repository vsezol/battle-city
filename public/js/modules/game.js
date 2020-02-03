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
		this.tanks[0].moveBullets()
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
		this.tanks[0].move(direction)
	}
}

export default Game
