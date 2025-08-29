import GameMoveService from '../services/GameMove.js'

class GameMoveFactory {
  constructor() {
    this.service = new GameMoveService()
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new GameMoveFactory()
    }
    return this._instance
  }

  static getAll(options) {
    return this.instance.service.getAll(options)
  }

  static getById(id) {
    return this.instance.service.getById(id)
  }

  static getByGameId(gameId) {
    return this.instance.service.getByGameId(gameId)
  }

  static getByUserId(userId) {
    return this.instance.service.getByUserId(userId)
  }

  static createMove(data) {
    return this.instance.service.createMove(data)
  }

  static deleteByGameId(gameId) {
    return this.instance.service.deleteByGameId(gameId)
  }

  static deleteByUserId(userId) {
    return this.instance.service.deleteByUserId(userId)
  }
}

export default GameMoveFactory
