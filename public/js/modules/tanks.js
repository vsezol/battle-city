import Bullet from './bullet'
import uid from 'uid'

class Tank {
	constructor(size, bulletSize, id, direction = 0) {
		this.type = 999
		this.direction = direction
		this.x = 256
		this.y = 256
		this.lastX = this.x
		this.lastY = this.y
		this.lastFireTime = 0
		this.bulletSize = bulletSize
		this.bulletDamage = 1
		this.size = size
		this.bullets = []
		this.hp = 2
		this.id = id
		this.banDirection = [[], [], [], []]
	}

	getData() {
		return [this.type, this.direction, this.x, this.y]
	}

	getCenter() {
		return [this.x + this.size / 2, this.y + this.size / 2]
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
					this.bulletSpeed,
					this.bulletDamage,
					this.bulletSize,
					uid(10)
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
					this.bulletSpeed,
					this.bulletDamage,
					this.bulletSize,
					uid(10)
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
					this.bulletSpeed,
					this.bulletDamage,
					this.bulletSize,
					uid(10)
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
					this.bulletSpeed,
					this.bulletDamage,
					this.bulletSize,
					uid(10)
				)
			)
		}
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

	checkDirection(otherTanks) {
		if (this.direction == 0) {
			this.banDirection[0] = this.banDirection[0].splice(
				0,
				otherTanks.length
			)
			otherTanks.forEach((tank, i) => {
				if (
					Math.abs(this.x - tank.x) < this.size &&
					this.y - tank.y > 0 &&
					Math.abs(this.y - tank.y) < this.size + this.speed
				) {
					this.banDirection[0].unshift(1)
				} else {
					this.banDirection[0].unshift(0)
				}
			})
		} else if (this.direction == 2) {
			this.banDirection[2] = this.banDirection[2].splice(
				0,
				otherTanks.length
			)
			otherTanks.forEach((tank, i) => {
				if (
					Math.abs(this.x - tank.x) < this.size &&
					this.y - tank.y < 0 &&
					Math.abs(this.y - tank.y) < this.size + this.speed
				) {
					this.banDirection[2].unshift(1)
				} else {
					this.banDirection[2].unshift(0)
				}
			})
		} else if (this.direction == 1) {
			this.banDirection[1] = this.banDirection[1].splice(
				0,
				otherTanks.length
			)
			otherTanks.forEach((tank, i) => {
				if (
					Math.abs(this.y - tank.y) < this.size &&
					this.x - tank.x < 0 &&
					Math.abs(this.x - tank.x) < this.size + this.speed
				) {
					this.banDirection[1].unshift(1)
				} else {
					this.banDirection[1].unshift(0)
				}
			})
		} else if (this.direction == 3) {
			this.banDirection[3] = this.banDirection[3].splice(
				0,
				otherTanks.length
			)
			otherTanks.forEach((tank, i) => {
				if (
					Math.abs(this.y - tank.y) < this.size &&
					this.x - tank.x > 0 &&
					Math.abs(this.x - tank.x) < this.size + this.speed
				) {
					this.banDirection[3].unshift(1)
				} else {
					this.banDirection[3].unshift(0)
				}
			})
		}
	}

	move(direction) {
		this.lastX = this.x
		this.lastY = this.y
		if (
			direction == 0 &&
			(!this.banDirection[0].length ||
				this.banDirection[0].reduce((p, c) => (p += c)) == 0)
		) {
			this.y -= this.speed
		} else if (
			direction == 2 &&
			(!this.banDirection[2].length ||
				this.banDirection[2].reduce((p, c) => (p += c)) == 0)
		) {
			this.y += this.speed
		} else if (
			direction == 1 &&
			(!this.banDirection[1].length ||
				this.banDirection[1].reduce((p, c) => (p += c)) == 0)
		) {
			this.x += this.speed
		} else if (
			direction == 3 &&
			(!this.banDirection[3].length ||
				this.banDirection[3].reduce((p, c) => (p += c)) == 0)
		) {
			this.x -= this.speed
		}
	}

	setCords(x, y) {
		this.x = x
		this.y = y
		this.lastX = x
		this.lastY = y
	}

	getDamage(damage) {
		this.hp -= damage
	}
}

class PlayerTank extends Tank {
	constructor(size, bulletSize, id) {
		super(size, bulletSize, id)
		this.type = 0
		this.speed = 4
		this.bulletSpeed = 4
		this.fireDelay = 60
	}
}

class EnemyTank extends Tank {
	constructor(size, bulletSize, id) {
		super(size, bulletSize, id)
		this.type = 3
		this.speed = 2
		this.bulletSpeed = 4
		this.fireDelay = 120
	}

	findFriendOnDirection(tanks) {
		for (let i = 0; i < tanks.length; i++) {
			const tank = tanks[i]
			if (this.direction == 0) {
				if (
					Math.abs(this.x - tank.x) <= this.size &&
					this.y - tank.y >= 0
				) {
					return 0
				}
			} else if (this.direction == 2) {
				if (
					Math.abs(this.x - tank.x) <= this.size &&
					this.y - tank.y <= 0
				) {
					return 2
				}
			} else if (this.direction == 1) {
				if (
					Math.abs(this.y - tank.y) <= this.size &&
					this.x - tank.x <= 0
				) {
					return 1
				}
			} else if (this.direction == 3) {
				if (
					Math.abs(this.y - tank.y) <= this.size &&
					this.x - tank.x >= 0
				) {
					return 3
				}
			} else {
				return -1
			}
		}
	}

	findTankOnDirection(uTank) {
		if (this.direction == 0) {
			if (
				Math.abs(this.x - uTank.x) <= this.size &&
				this.y - uTank.y >= 0
			) {
				return [true, uTank.y]
			}
		} else if (this.direction == 2) {
			if (
				Math.abs(this.x - uTank.x) <= this.size &&
				this.y - uTank.y <= 0
			) {
				return [true, uTank.y]
			}
		} else if (this.direction == 1) {
			if (
				Math.abs(this.y - uTank.y) <= this.size &&
				this.x - uTank.x <= 0
			) {
				return [true, uTank.x]
			}
		} else if (this.direction == 3) {
			if (
				Math.abs(this.y - uTank.y) <= this.size &&
				this.x - uTank.x >= 0
			) {
				return [true, uTank.x]
			}
		} else {
			return [false, false]
		}
	}

	randomDistance(min = this.size*2, max = this.size*3) {
		return Math.round(Math.random() * (max - min) + min)
	}

	randomRotate(min = 0, max = 3) {
		return Math.round(Math.random() * (max - min) + min)
	}

	setTarget(distance) {
		if (this.direction == 0) {
			this.toX = this.x
			this.toY = this.y - distance
		} else if (this.direction == 2) {
			this.toX = this.x
			this.toY = this.y + distance
		} else if (this.direction == 1) {
			this.toX = this.x + distance
			this.toY = this.y
		} else if (this.direction == 3) {
			this.toX = this.x - distance
			this.toY = this.y
		}
	}

	isCompleteTarget() {
		if (this.toX === undefined && this.toY === undefined) {
			return 'no target'
		}
		if (this.direction == 0) {
			if (this.toY - this.y > 0) return true
		} else if (this.direction == 2) {
			if (this.toY - this.y < 0) return true
		} else if (this.direction == 1) {
			if (this.toX - this.x < 0) return true
		} else if (this.direction == 3) {
			if (this.toX - this.x > 0) return true
		} else {
			return false
		}
	}
}

export { PlayerTank, EnemyTank }
