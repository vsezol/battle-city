class SpriteSheet {
	constructor(src, w, h, x, y, size) {
		this.w = w
		this.h = h
		this.x = x
		this.y = y
		this.size = size
		this.src = src
	}

	onLoad() {
		return new Promise((response, reject) => {
			this.img = new Image()
			this.img.src = this.src
			this.img.onload = () => response()
		})
	}

	drawSprite(context, spriteCords, imgCords) {
		const spriteX = spriteCords[0] * this.size
		const spriteY = spriteCords[1] * this.size
		context.drawImage(
			this.img,
			spriteX,
			spriteY,
			this.size,
			this.size,
			imgCords[0],
			imgCords[1],
			this.size,
			this.size
		)
	}
}

export default SpriteSheet