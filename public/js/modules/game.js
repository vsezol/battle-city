class Game {
	constructor(w, h, bg, tanks, bullets = [], blocks = []) {
		this.w = w
		this.h = h
		this.bg = bg
		this.tanks = tanks
		this.bullets = bullets
		this.blocks = blocks
		this.timer = 0
		this.maxScore = tanks.length - 1
	}

	limitArea() {
		this.tanks.forEach((item, i) => {
			const itemCords = item.getData().slice(2)
			let x = itemCords[0]
			let y = itemCords[1]

			if (y >= this.h - item.size) {
				y = this.h - item.size
				item.setCords(x, y)
				if (i != 0) {
					const rotates = [0, 1, 3]
					const rd = rotates[Math.round(Math.random() * 2)]
					item.rotate(rd, this.timer)
					item.setTarget(item.randomDistance())
				}
			} else if (y <= 0) {
				y = 0
				item.setCords(x, y)
				if (i != 0) {
					const rotates = [2, 1, 3]
					const rd = rotates[Math.round(Math.random() * 2)]
					item.rotate(rd, this.timer)
					item.setTarget(item.randomDistance())
				}
			}
			if (x >= this.w - item.size) {
				x = this.w - item.size
				item.setCords(x, y)
				if (i != 0) {
					const rotates = [0, 2, 3]
					const rd = rotates[Math.round(Math.random() * 2)]
					item.rotate(rd, this.timer)
					item.setTarget(item.randomDistance())
				}
			} else if (x <= 0) {
				x = 0
				item.setCords(x, y)
				if (i != 0) {
					const rotates = [0, 1, 2]
					const rd = rotates[Math.round(Math.random() * 2)]
					item.rotate(rd, this.timer)
					item.setTarget(item.randomDistance())
				}
			}
		})
	}

	drawAll(context, tanksSprites, bulletsSprites, blocksSprites) {
		this.limitArea()

		this.tanks.forEach(tank => {
			const tankSpriteCords = tank.getData().slice(0, 2)
			const tankCords = tank.getData().slice(2)
			tanksSprites.drawSprite(context, tankSpriteCords, tankCords)
			tank.limitBullets(this.w, this.h)
			tank.getBullets().forEach(bullet => {
				bulletsSprites.drawSprite(context, [0, 0], bullet.getCords())
			})
		})

		this.blocks.forEach(block => {
			blocksSprites.drawSprite(
				context,
				[block.type, 0],
				[block.x, block.y]
			)
		})

		this.tanks.forEach(tank => {
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

	watchKeyBoard(fireSound) {
		onkeydown = e => {
			if (e.key === 'ArrowUp') {
				this.userRotate(0, this.timer)
				this.userMove(0)
			} else if (e.key === 'ArrowDown') {
				this.userRotate(2, this.timer)
				this.userMove(2)
			} else if (e.key === 'ArrowRight') {
				this.userRotate(1, this.timer)
				this.userMove(1)
			} else if (e.key === 'ArrowLeft') {
				this.userRotate(3, this.timer)
				this.userMove(3)
			} else if (e.key === ' ') {
				if (
					this.timer - this.tanks[0].lastFireTime >
					this.tanks[0].fireDelay
				) {
					fireSound.play()
					this.tanks[0].lastFireTime = this.timer
					this.tanks[0].fire()
				}
			}
		}
	}

	userRotate(direction, timer) {
		this.tanks[0].rotate(direction, this.timer)
	}

	userMove(direction) {
		this.tanks[0].lastX = this.tanks[0].x
		this.tanks[0].lastY = this.tanks[0].y
		this.tanks[0].move(direction)
	}

	checkTanksCollisions() {
		const tanks = this.tanks
		tanks.forEach((tank, i, tanks) => {
			tank.checkDirection([
				...tanks.slice(0, i),
				...tanks.slice(i + 1),
				...this.blocks
			])
		})
	}

	checkBulletsCollisions(dieSound) {
		const tanks = this.tanks
		const userBullets = tanks[0].bullets
		const tankSize = tanks[0].size

		userBullets.forEach((bullet, i, bullets) => {
			tanks.slice(1).forEach(tank => {
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
					dieSound.play()
				}
			})
			this.blocks.forEach(block => {
				const blockC = block.getCenter()
				const bulletC = bullet.getCenter()

				const dX = blockC[0] - bulletC[0]
				const dY = blockC[1] - bulletC[1]
				if (
					Math.abs(dX) <= tankSize / 2 + bullet.size / 2 &&
					Math.abs(dY) <= tankSize / 2 + bullet.size / 2
				) {
					bullets.splice(i, 1)
					block.getDamage(bullet.damage)
					dieSound.play()
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
						dieSound.play()
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

		if (this.tanks[0].hp <= 0) return false
		this.tanks = this.tanks.filter(tank => tank.hp > 0)
		this.blocks = this.blocks.filter(block => block.hp > 0)
		if (this.tanks.length == 1 && this.tanks[0].hp > 0) return true
	}

	checkCollisions(dieSound) {
		this.checkTanksCollisions()
		const gameState = this.checkBulletsCollisions(dieSound)
		return gameState
	}

	enemyBrain() {
		const userTank = this.tanks[0]
		const enemyTanks = this.tanks.slice(1)
		enemyTanks.forEach((eTank, i, eTanks) => {
			const goToKill = eTank.findTankOnDirection(userTank)
			if (goToKill) {
				eTank.rotate(eTank.direction, this.timer)
				eTank.setTarget(goToKill[1])
			}
			if (eTank.isCompleteTarget() == true) {
				eTank.rotate(eTank.randomRotate(), this.timer)
				eTank.setTarget(eTank.randomDistance())
			} else if (eTank.isCompleteTarget() === 'no target') {
				eTank.rotate(eTank.randomRotate(), this.timer)
				eTank.setTarget(eTank.randomDistance())
			} else {
				eTank.move(eTank.direction)
			}

			const friends = [...eTanks, ...this.blocks]
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
				eTank.rotate(eTank.randomRotate(), this.timer)
				eTank.setTarget(eTank.randomDistance())
			}
		})
	}

	getScore() {
		return this.maxScore - (this.tanks.length - 1)
	}

	transformUser() {
		const score = this.getScore()
		if (score >= 1 && score < 2) {
			this.tanks[0].transformToNewType(1)
		} else if(score >= 2) {
			this.tanks[0].transformToNewType(2)
		}
	}
}

export default Game
