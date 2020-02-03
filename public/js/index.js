import SpriteSheet from './modules/sprite-sheet'
import Bullet from './modules/bullet'
import {DefaultTank} from './modules/tanks'
import Game from './modules/game'
import Block from './modules/block'

const tanksSRC = './public/img/tanks/ts.png'
const bulletSRC = './public/img/tanks/normal_bullet.png'
const gameBg = 'black'
const gameW = 600
const gameH = 600
const gameFPS = 60
const tankSize = 75
const bulletSize = 17
const updateTime = parseInt(1000/gameFPS)

const canvas = document.querySelector('#game-display')
const context = canvas.getContext('2d')

canvas.width = gameW
canvas.height = gameH
canvas.style.background = gameBg

const tanksSprites = new SpriteSheet(tanksSRC, 75, 300, 0, 3, tankSize)
const bulletsSprites = new SpriteSheet(bulletSRC, 17, 17, 0, 0, bulletSize)
const blocksSprites = new SpriteSheet(bulletSRC, 17, 17, 0, 0, bulletSize)

let playerTank = new DefaultTank(tankSize, bulletSize)
let game = new Game(gameW, gameH, gameBg, [playerTank], [], [])

async function loadGame() {
	await tanksSprites.onLoad()
	await bulletsSprites.onLoad()
	await blocksSprites.onLoad()
	setInterval(update, updateTime)
}
loadGame()
function update() {
	game.clearAll(context)
	game.drawAll(context, tanksSprites, bulletsSprites)
	game.watchKeyBoard()
}
