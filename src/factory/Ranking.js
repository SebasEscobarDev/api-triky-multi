import RankingService from '../services/Ranking.js'

class RankingFactory {
  constructor() {
    this.service = new RankingService()
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new RankingFactory()
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

  static createOrUpdateRanking(userId, data) {
    return this.instance.service.createOrUpdateRanking(userId, data)
  }

  static updateRankingAfterGame(gameId, winnerId, player1Id, player2Id, isDraw) {
    return this.instance.service.updateRankingAfterGame(gameId, winnerId, player1Id, player2Id, isDraw)
  }

  static recalculateRanks() {
    return this.instance.service.recalculateRanks()
  }

  static getTopPlayers(limit) {
    return this.instance.service.getTopPlayers(limit)
  }
}

export default RankingFactory
