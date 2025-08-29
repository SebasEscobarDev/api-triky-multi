import { Op } from 'sequelize'
import uuid4 from 'uuid4'
import { Game, User, GameMove } from '../models/associations.js'

class GameService {
  constructor() {
    this.model = Game
    this.attributes = ['id', 'player1_id', 'player2_id', 'current_player_id', 'board_state', 'winner_id', 'is_draw', 'status', 'created_at', 'updated_at', 'completed_at']
    this.include = [
      { model: User, as: 'player1', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'player2', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'currentPlayer', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'winner', attributes: ['id', 'name', 'email'] }
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
      queryOptions.order = [['created_at', 'DESC']]
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
    return this.model.findAll({
      where: {
        [Op.or]: [
          { player1_id: userId },
          { player2_id: userId }
        ]
      },
      attributes: this.attributes,
      include: this.include,
      order: [['created_at', 'DESC']]
    })
  }

  async createGame(data) {
    // Initialize empty board (null represents empty cell)
    const boardState = Array(9).fill(null)
    
    const gameData = {
      id: uuid4(),
      player1_id: data.player1_id,
      player2_id: data.player2_id,
      current_player_id: data.player1_id, // Player 1 starts
      board_state: boardState,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }

    return this.model.create(gameData)
  }

  async updateGame(id, data) {
    const game = await this.getById(id)
    if (!game) {
      throw new Error('Game not found')
    }

    // Update allowed fields
    const updatableFields = ['status']
    const updateData = {}
    
    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    })
    
    updateData.updated_at = new Date()
    
    if (data.status === 'completed' && !game.completed_at) {
      updateData.completed_at = new Date()
    }

    await game.update(updateData)
    return this.getById(id)
  }

  async deleteGame(id) {
    const game = await this.getById(id)
    if (!game) {
      throw new Error('Game not found')
    }

    return game.destroy()
  }

  async deleteAllUserGames(userId) {
    return this.model.destroy({
      where: {
        [Op.or]: [
          { player1_id: userId },
          { player2_id: userId }
        ]
      }
    })
  }

  async makeMove(gameId, userId, position) {
    const game = await this.getById(gameId)
    if (!game) {
      throw new Error('Game not found')
    }

    // Check if it's the user's turn
    if (game.current_player_id !== userId) {
      throw new Error('Not your turn')
    }

    // Check if game is still active
    if (game.status !== 'active') {
      throw new Error('Game is not active')
    }

    // Check if position is valid and empty
    if (position < 0 || position > 8) {
      throw new Error('Invalid position')
    }

    const boardState = game.board_state
    if (boardState[position] !== null) {
      throw new Error('Position already taken')
    }

    // Make the move
    const isPlayer1 = userId === game.player1_id
    const symbol = isPlayer1 ? 'X' : 'O'
    boardState[position] = symbol

    // Calculate position_x and position_y for the game move
    const position_x = position % 3
    const position_y = Math.floor(position / 3)

    // Create game move record
    await GameMove.create({
      id: uuid4(),
      game_id: gameId,
      user_id: userId,
      position_x,
      position_y,
      move_number: boardState.filter(cell => cell !== null).length,
      created_at: new Date()
    })

    // Check for win
    const winner = this.checkWinner(boardState)
    const updateData = {
      board_state: boardState,
      updated_at: new Date()
    }

    // Switch player turn if no winner
    if (!winner) {
      // Check for draw
      const isDraw = !boardState.includes(null)
      if (isDraw) {
        updateData.status = 'completed'
        updateData.is_draw = true
        updateData.completed_at = new Date()
      } else {
        // Switch turns
        updateData.current_player_id = isPlayer1 ? game.player2_id : game.player1_id
      }
    } else {
      // We have a winner
      updateData.status = 'completed'
      updateData.winner_id = userId
      updateData.completed_at = new Date()
    }

    await game.update(updateData)
    return this.getById(gameId)
  }

  checkWinner(boardState) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ]

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a]
      }
    }

    return null
  }
}

export default GameService
