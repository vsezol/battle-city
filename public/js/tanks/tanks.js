import { PlayerTank, EnemyTank } from '../modules/tanks'

const tankSize = 75
const bulletSize = 17

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

export default [playerTank, enemyTank1, enemyTank2, enemyTank3, enemyTank4]