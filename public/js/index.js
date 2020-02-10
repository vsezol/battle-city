import SpriteSheet from './modules/sprite-sheet'
import { PlayerTank, EnemyTank } from './modules/tanks'
import Game from './modules/game'

const tanksSRC = './public/img/tanks/ts.png'
const bulletSRC = './public/img/tanks/normal_bullet.png'
const gameBg = 'black'
const gameW = window.innerWidth
const gameH = window.innerHeight * 0.95
const gameFPS = 60
const tankSize = 75
const bulletSize = 17
const updateTime = parseInt(1000 / gameFPS)

//canvas
const canvas = document.querySelector('#game-display')
const context = canvas.getContext('2d')
canvas.width = gameW
canvas.height = gameH
canvas.style.display = 'none'
canvas.style.background = gameBg

//game blocks
const menuBlock = document.querySelector('#menu')
const menuLink = document.querySelector('#menu-block')
const scoreDesk = document.querySelector('.score-desk')
const scoreBlock = document.querySelector('#score-block')
const winBlock = document.querySelector('.win-block')
const loseBlock = document.querySelector('.lose-block')

//buttons
const newGameButton = document.querySelector('.new-game-btn')
newGameButton.addEventListener('click', async e => {
	menuBlock.style.display = 'none'
	scoreDesk.style.display = 'flex'
	await new Promise(res => {
		beginSound.play()
		beginSound.addEventListener('ended', () => {
			loadGame()
		})
	})
})
const restartButtons = document.querySelectorAll('.restart')
restartButtons.forEach(item => {
	item.addEventListener('click', e => location.reload())
})
menuLink.addEventListener('click', e => {
	scoreDesk.style.display = 'none'
	menuBlock.style.display = 'flex'
	canvas.style.display = 'none'
	clearInterval(gameReloadID)
})

//sounds
const beginSound = new Audio('./public/sounds/begin.mp3')
const beginSoundLoading = new Promise(res => {
	beginSound.addEventListener('loadeddata', () => res())
})
const motorSound = new Audio('./public/sounds/motor_sound.mp3')
const motorSoundLoading = new Promise(res => {
	motorSound.addEventListener('loadeddata', () => res())
})
const driveSound = new Audio('./public/sounds/motor_sound.mp3')
const driveSoundLoading = new Promise(res => {
	driveSound.addEventListener('loadeddata', () => res())
})
let lastUserAction = 'none'

const playSoundLoop = sound => {
	sound.play()
	sound.addEventListener('ended', () => {
		sound.play()
	})
}

//sprites
const tanksSprites = new SpriteSheet(tanksSRC, 450, 300, tankSize)
const bulletsSprites = new SpriteSheet(bulletSRC, 17, 17, bulletSize)
const blocksSprites = new SpriteSheet(bulletSRC, 17, 17, bulletSize)

//player tank
const playerTank = new PlayerTank(tankSize, bulletSize, 'player')

//enemy tanks
const enemyTank1 = new EnemyTank(tankSize, bulletSize, 'enemy 1')
enemyTank1.setCords(150, 150)
enemyTank1.rotate(1)
const enemyTank2 = new EnemyTank(tankSize, bulletSize, 'enemy 2')
enemyTank2.setCords(600, 600)
enemyTank2.rotate(2)
const enemyTank3 = new EnemyTank(tankSize, bulletSize, 'enemy 3')
enemyTank3.setCords(1000, 270)
enemyTank3.rotate(3)
const enemyTank4 = new EnemyTank(tankSize, bulletSize, 'enemy 3')
enemyTank4.setCords(600, 270)
enemyTank4.rotate(0)

//new game
let game = new Game(
	gameW,
	gameH,
	gameBg,
	[playerTank, enemyTank1, enemyTank2, enemyTank3, enemyTank4],
	[],
	[]
)

const preload = async () => {
	await tanksSprites.onLoad()
	await bulletsSprites.onLoad()
	await blocksSprites.onLoad()
	await beginSoundLoading
	await motorSoundLoading
	await driveSoundLoading
	menuBlock.style.display = 'flex'
}
preload()

//game
let gameReloadID = undefined
async function loadGame() {
	canvas.style.display = 'block'
	gameReloadID = setInterval(update, updateTime)
	playSoundLoop(motorSound)
}

async function update() {
	game.clearAll(context)
	game.drawAll(context, tanksSprites, bulletsSprites)
	const gameState = game.checkCollisions()
	const userAction = game.watchKeyBoard()
	game.watchKeyBoard()
	game.enemyBrain()
	// if (userAction === 'drive') {
	// 	motorSound.pause()
	// 	playSoundLoop(driveSound)
	// }
	// if (userAction === 'none') {
	// 	driveSound.pause()
	// } else if (userAction === lastUserAction) {
	// 	lastUserAction = userAction
	// 	if (userAction === 'drive') {
	// 		playSoundLoop(driveSound)
	// 	} else {
	// 		driveSound.pause()
	// 	}
	// } else {
	// 	lastUserAction = userAction
	// }

	const score = game.getScore()
	scoreBlock.innerHTML = `SCORE <span style="color: red;">${score}</span>`
	if (gameState == true) {
		winGame(canvas, winBlock)
	} else if (gameState == false) {
		loseGame(canvas, loseBlock)
	}
}

function winGame(cvs, winBlock) {
	clearInterval(gameReloadID)
	motorSound.pause()
	driveSound.pause()
	cvs.style.display = 'none'
	winBlock.style.display = 'flex'
}

function loseGame(cvs, loseBlock) {
	motorSound.pause()
	driveSound.pause()
	clearInterval(gameReloadID)
	cvs.style.display = 'none'
	loseBlock.style.display = 'flex'
}
