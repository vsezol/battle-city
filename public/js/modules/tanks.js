import Bullet from './bullet'

class Tank {
	constructor(size, bulletSize, direction = 0) {
		this.type = 999
		this.direction = direction
		this.x = 256
		this.y = 256
		this.lastX = this.x
		this.lastY = this.y
		this.fireDelay = 40
		this.lastFireTime = 0
		this.bulletSpeed = 5
		this.bulletSize = bulletSize
		this.size = size
		this.bullets = []
	}

	getData() {
		return [this.type, this.direction, this.x, this.y]
	}

	getCords() {
		return [this.x, this.y]
	}

	getBullets() {
		return this.bullets
	}

	fire() {
		if (this.direction == 0) {
			this.bullets.push(
				new Bullet(
					this.direction,
					this.x +
						parseInt(this.size / 2) -
						parseInt(this.bulletSize / 2),
					this.y - 10,
					this.bulletSpeed
				)
			)
		} else if (this.direction == 2) {
			this.bullets.push(
				new Bullet(
					this.direction,
					this.x +
						parseInt(this.size / 2) -
						parseInt(this.bulletSize / 2),
					this.y + this.size - 10,
					this.bulletSpeed
				)
			)
		} else if (this.direction == 1) {
			this.bullets.push(
				new Bullet(
					this.direction,
					this.x + this.size - 10,
					this.y +
						parseInt(this.size / 2) -
						parseInt(this.bulletSize / 2),
					this.bulletSpeed
				)
			)
		} else if (this.direction == 3) {
			this.bullets.push(
				new Bullet(
					this.direction,
					this.x - 10,
					this.y +
						parseInt(this.size / 2) -
						parseInt(this.bulletSize / 2),
					this.bulletSpeed
				)
			)
		}
		console.log(this.bullets)
	}

	limitBullets(w, h) {
		this.bullets.forEach((item, i, array) => {
			const x = item.x
			const y = item.y
			if (y >= h) {
				array.splice(i, 1)
			} else if (y <= 0) {
				array.splice(i, 1)
			}
			if (x >= w) {
				array.splice(i, 1)
			} else if (x <= 0) {
				array.splice(i, 1)
			}
		})
	}

	moveBullets() {
		this.bullets.forEach((item, i, array) => {
			item.move()
		})
	}

	rotate(direction) {
		this.direction = direction
	}

	move(direction) {
		if (direction == 0) {
			this.y -= this.speed
		} else if (direction == 2) {
			this.y += this.speed
		} else if (direction == 1) {
			this.x += this.speed
		} else if (direction == 3) {
			this.x -= this.speed
		}
	}

	setCords(x, y) {
		this.x = x
		this.y = y
	}
}

class PlayerTank extends Tank {
	constructor(size, bulletSize, id) {
		super(size, bulletSize, id)
		this.type = 0
		this.speed = 4
	}
}

class EnemyTank extends Tank {
	constructor(size, bulletSize) {
		super(size, bulletSize)
		this.type = 3
		this.speed = 4
	}
}

export {PlayerTank, EnemyTank}
