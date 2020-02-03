class Bullet {
	constructor(direction, x, y, speed) {
		this.direction = direction
		this.x = x
		this.y = y
		this.speed = speed
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
}

export default Bullet