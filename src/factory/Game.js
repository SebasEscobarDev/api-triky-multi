import GameService from '../services/Game.js'

class GameFactory {
  constructor() {
    this.service = new GameService()
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new GameFactory()
    }
    return this._instance
  }

  static getAll(options) {
    return this.instance.service.getAll(options)
  }

  static getById(id) {
    return this.instance.service.getById(id)
  }

  static getByUserId(userId) {
    return this.instance.service.getByUserId(userId)
  }

  static createGame(data) {
    return this.instance.service.createGame(data)
  }

  static updateGame(id, data) {
    return this.instance.service.updateGame(id, data)
  }

  static deleteGame(id) {
    return this.instance.service.deleteGame(id)
  }

  static deleteAllUserGames(userId) {
    return this.instance.service.deleteAllUserGames(userId)
  }

  static makeMove(gameId, userId, position) {
    return this.instance.service.makeMove(gameId, userId, position)
  }
}

export default GameFactory
