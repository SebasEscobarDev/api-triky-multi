import uuid4 from 'uuid4'
import { Ranking, User } from '../models/associations.js'

class RankingService {
  constructor() {
    this.model = Ranking
    this.attributes = ['id', 'user_id', 'points', 'wins', 'losses', 'draws', 'rank', 'updated_at']
    this.include = [
      { model: User, attributes: ['id', 'name', 'email'] }
    ]
  }

  async getAll(options = {}) {
    const queryOptions = {
      attributes: this.attributes,
      include: this.include
    }

    if (options.limit) {
      queryOptions.limit = options.limit
    }

    if (options.offset) {
      queryOptions.offset = options.offset
    }

    if (options.where) {
      queryOptions.where = options.where
    }

    // Default ordering by rank (best players first)
    if (options.order) {
      queryOptions.order = options.order
    } else {
      queryOptions.order = [['rank', 'ASC']]
    }

    return this.model.findAndCountAll(queryOptions)
  }

  async getById(id) {
    return this.model.findByPk(id, {
      attributes: this.attributes,
      include: this.include
    })
  }

  async getByUserId(userId) {
    return this.model.findOne({
      where: { user_id: userId },
      attributes: this.attributes,
      include: this.include
    })
  }

  async createOrUpdateRanking(userId, data = {}) {
    let ranking = await this.getByUserId(userId)
    const now = new Date()
    
    if (!ranking) {
      // Create new ranking for the user
      ranking = await this.model.create({
        id: uuid4(),
        user_id: userId,
        points: data.points || 0,
        wins: data.wins || 0,
        losses: data.losses || 0,
        draws: data.draws || 0,
        rank: 0, // Will be updated later
        updated_at: now
      })
    } else {
      // Update existing ranking
      const updateData = {
        updated_at: now
      }
      
      if (data.points !== undefined) updateData.points = data.points
      if (data.wins !== undefined) updateData.wins = data.wins
      if (data.losses !== undefined) updateData.losses = data.losses
      if (data.draws !== undefined) updateData.draws = data.draws
      
      await ranking.update(updateData)
    }
    
    // Recalculate ranks for all users
    await this.recalculateRanks()
    
    // Return the updated ranking
    return this.getByUserId(userId)
  }

  async updateRankingAfterGame(gameId, winnerId, player1Id, player2Id, isDraw) {
    // Get current rankings for both players
    const player1Ranking = await this.getByUserId(player1Id) || await this.createOrUpdateRanking(player1Id)
    const player2Ranking = await this.getByUserId(player2Id) || await this.createOrUpdateRanking(player2Id)
    
    // Points to award
    const WIN_POINTS = 3
    const DRAW_POINTS = 1
    
    if (isDraw) {
      // It's a draw
      await player1Ranking.update({
        points: player1Ranking.points + DRAW_POINTS,
        draws: player1Ranking.draws + 1,
        updated_at: new Date()
      })
      
      await player2Ranking.update({
        points: player2Ranking.points + DRAW_POINTS,
        draws: player2Ranking.draws + 1,
        updated_at: new Date()
      })
    } else {
      // Someone won
      const winnerId = player1Ranking.user_id
      const loserId = player2Ranking.user_id
      
      await this.model.update({
        points: player1Ranking.points + WIN_POINTS,
        wins: player1Ranking.wins + 1,
        updated_at: new Date()
      }, { where: { user_id: winnerId } })
      
      await this.model.update({
        losses: player2Ranking.losses + 1,
        updated_at: new Date()
      }, { where: { user_id: loserId } })
    }
    
    // Recalculate ranks
    await this.recalculateRanks()
  }

  async recalculateRanks() {
    // Get all players sorted by points (descending)
    const rankings = await this.model.findAll({
      order: [['points', 'DESC']]
    })
    
    // Update ranks
    for (let i = 0; i < rankings.length; i++) {
      const rank = i + 1
      await rankings[i].update({ rank })
    }
  }

  async getTopPlayers(limit = 10) {
    return this.model.findAll({
      attributes: this.attributes,
      include: this.include,
      order: [['rank', 'ASC']],
      limit
    })
  }
}

export default RankingService
