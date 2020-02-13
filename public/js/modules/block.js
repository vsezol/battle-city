class Block {
	constructor(type, x, y) {
		this.type = type
		this.x = x
		this.y = y
		this.size = 75
		this.direction = 0
		if (type == 2) {
			this.hp = 4
		} else if (type == 1) {
			this.hp = 2
		} else {
			this.hp = 999
		}
	}

	getType() {
		return this.type
	}

	getCords() {
		return [this.x, this.y]
	}

	getCenter() {
		return [this.x + this.size / 2, this.y + this.size / 2]
	}

	getDamage(damage) {
		this.hp -= damage
	}
}

export default Block