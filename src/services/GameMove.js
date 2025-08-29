import { Op } from 'sequelize'
import uuid4 from 'uuid4'
import { GameMove, Game, User } from '../models/associations.js'

class GameMoveService {
  constructor() {
    this.model = GameMove
    this.attributes = ['id', 'game_id', 'user_id', 'position_x', 'position_y', 'move_number', 'created_at']
    this.include = [
      { model: Game, attributes: ['id', 'status'] },
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

    if (options.order) {
      queryOptions.order = options.order
    } else {
      queryOptions.order = [['created_at', 'ASC']]
    }

    return this.model.findAndCountAll(queryOptions)
  }

  async getById(id) {
    return this.model.findByPk(id, {
      attributes: this.attributes,
      include: this.include
    })
  }

  async getByGameId(gameId) {
    return this.model.findAll({
      where: { game_id: gameId },
      attributes: this.attributes,
      include: this.include,
      order: [['move_number', 'ASC']]
    })
  }

  async getByUserId(userId) {
    return this.model.findAll({
      where: { user_id: userId },
      attributes: this.attributes,
      include: this.include,
      order: [['created_at', 'DESC']]
    })
  }

  async createMove(data) {
    const moveData = {
      id: uuid4(),
      game_id: data.game_id,
      user_id: data.user_id,
      position_x: data.position_x,
      position_y: data.position_y,
      move_number: data.move_number,
      created_at: new Date()
    }

    return this.model.create(moveData)
  }

  async deleteByGameId(gameId) {
    return this.model.destroy({
      where: { game_id: gameId }
    })
  }

  async deleteByUserId(userId) {
    return this.model.destroy({
      where: { user_id: userId }
    })
  }
}

export default GameMoveService
