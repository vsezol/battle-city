import SpriteSheet from './modules/sprite-sheet'
import Bullet from './modules/bullet'
import {PlayerTank, EnemyTank} from './modules/tanks'
import Game from './modules/game'
import Block from './modules/block'

const tanksSRC = './public/img/tanks/ts.png'
const bulletSRC = './public/img/tanks/normal_bullet.png'
const gameBg = 'black'
const gameW = window.innerWidth
const gameH = window.innerHeight
const gameFPS = 60
const tankSize = 75
const bulletSize = 17
const updateTime = parseInt(1000/gameFPS)

const canvas = document.querySelector('#game-display')
const context = canvas.getContext('2d')

canvas.width = gameW
canvas.height = gameH
canvas.style.background = gameBg

const tanksSprites = new SpriteSheet(tanksSRC, 450, 300, tankSize)
const bulletsSprites = new SpriteSheet(bulletSRC, 17, 17, bulletSize)
const blocksSprites = new SpriteSheet(bulletSRC, 17, 17, bulletSize)

const playerTank = new PlayerTank(tankSize, bulletSize, 'player')

const enemyTank1 = new EnemyTank(tankSize, bulletSize, 'enemy 1')
enemyTank1.setCords(0,0)
enemyTank1.rotate(1)
const enemyTank2 = new EnemyTank(tankSize, bulletSize, 'enemy 2')
enemyTank2.setCords(50,50)
enemyTank2.rotate(2)
const enemyTank3 = new EnemyTank(tankSize, bulletSize, 'enemy 3')
enemyTank3.setCords(1000,270)
enemyTank3.rotate(3)

let game = new Game(gameW, gameH, gameBg, [playerTank, enemyTank1, enemyTank2, enemyTank3], [], [])

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
	game.checkCollisions()
	game.watchKeyBoard()
	game.enemyBrain()
}
