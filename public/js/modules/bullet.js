class Bullet {
	constructor(direction, x, y, speed, damage, size) {
		this.direction = direction
		this.x = x
		this.y = y
		this.speed = speed
		this.damage = damage
		this.size = size
	}

	move() {
		if (this.direction == 0) {
			this.y -= this.speed
		} else if (this.direction == 2) {
			this.y += this.speed
		} else if (this.direction == 1) {
			this.x += this.speed
		} else if (this.direction == 3) {
			this.x -= this.speed
		}
	}

	getCords() {
		return [this.x, this.y]
	}

	getCenter() {
		return [this.x + this.size / 2, this.y + this.size / 2]
	}
}

export default Bullet