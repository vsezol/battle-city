class Block {
	constructor(type, x, y) {
		this.type = type
		this.x = x
		this.y = y
	}

	getType() {
		return this.type
	}

	getCords() {
		return [this.x, this.y]
	}
}

export default Block