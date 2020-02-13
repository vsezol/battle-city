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
const fireSound = new Audio('./public/sounds/fire.mp3')
const fireSoundLoading = new Promise(res => {
	fireSound.addEventListener('loadeddata', () => res())
})
const dieSound = new Audio('./public/sounds/die.mp3')
const dieSoundLoading = new Promise(res => {
	dieSound.addEventListener('loadeddata', () => res())
})
const loseSound = new Audio('./public/sounds/lose.mp3')
const loseSoundLoading = new Promise(res => {
	dieSound.addEventListener('loadeddata', () => res())
})
const winSound = new Audio('./public/sounds/win.mp3')
const winSoundLoading = new Promise(res => {
	dieSound.addEventListener('loadeddata', () => res())
})

const sounds = [beginSound, motorSound, driveSound, fireSound, dieSound, loseSound, winSound]
const soundsPromises = [
	beginSoundLoading,
	motorSoundLoading,
	driveSoundLoading,
	fireSoundLoading,
	dieSoundLoading,
	loseSoundLoading,
	winSoundLoading
]

export { sounds, soundsPromises }
