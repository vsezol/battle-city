import SpriteSheet from './modules/sprite-sheet'
import tanksArray from './tanks/tanks'
import Game from './modules/game'
import {sounds, soundsPromises} from './sounds/sounds'
import blocks from './blocks/blocks'

const tanksSRC = './public/img/tanks/ts.png'
const bulletSRC = './public/img/tanks/normal_bullet.png'
const blocksSRC = './public/img/blocks/bs.png'
const gameBg = 'black'
const gameW = window.innerWidth
const gameH = window.innerHeight * 0.95
const gameFPS = 60
const tankSize = 75
const blockSize = 75
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
const beginSound = sounds[0]
const motorSound = sounds[1]
const driveSound = sounds[2]
const fireSound = sounds[3]
const dieSound = sounds[4]
const loseSound = sounds[5]
const winSound = sounds[6]

const playSoundLoop = sound => {
	sound.play()
	sound.addEventListener('ended', () => {
		sound.play()
	})
}

//sprites
const tanksSprites = new SpriteSheet(tanksSRC, 450, 300, tankSize)
const bulletsSprites = new SpriteSheet(bulletSRC, 17, 17, bulletSize)
const blocksSprites = new SpriteSheet(blocksSRC, 375, 75, blockSize)

//new game
let game = new Game(gameW, gameH, gameBg, tanksArray, [], blocks)

const preload = async () => {
	await tanksSprites.onLoad()
	await bulletsSprites.onLoad()
	await blocksSprites.onLoad()
	await Promise.all(soundsPromises)

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
	game.drawAll(context, tanksSprites, bulletsSprites, blocksSprites)
	const gameState = game.checkCollisions(dieSound)
	game.watchKeyBoard(fireSound)
	game.enemyBrain()
	game.transformUser()

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
	winSound.play()
	cvs.style.display = 'none'
	winBlock.style.display = 'flex'
}

function loseGame(cvs, loseBlock) {
	motorSound.pause()
	driveSound.pause()
	loseSound.play()
	clearInterval(gameReloadID)
	cvs.style.display = 'none'
	loseBlock.style.display = 'flex'
}
