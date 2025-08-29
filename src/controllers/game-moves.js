import GameMoveFactory from '../factory/GameMove.js'
import GameFactory from '../factory/Game.js'

const getAllMoves = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query
    const options = { limit: parseInt(limit), offset: parseInt(offset) }
    const result = await GameMoveFactory.getAll(options)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Error getting all game moves:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getMoveById = async (req, res) => {
  try {
    const { id } = req.params
    const move = await GameMoveFactory.getById(id)
    
    if (!move) {
      return res.status(404).json({ message: 'Movimiento no encontrado' })
    }
    
    return res.status(200).json(move)
  } catch (error) {
    console.error('Error getting move by ID:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getGameMoves = async (req, res) => {
  try {
    const { gameId } = req.params
    const userId = req.user.id
    
    // Verify that the user is a participant
    const game = await GameFactory.getById(gameId)
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' })
    }
    
    if (game.player1_id !== userId && game.player2_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para ver estos movimientos' })
    }
    
    const moves = await GameMoveFactory.getByGameId(gameId)
    return res.status(200).json(moves)
  } catch (error) {
    console.error('Error getting game moves:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getUserMoves = async (req, res) => {
  try {
    const userId = req.user.id
    const moves = await GameMoveFactory.getByUserId(userId)
    return res.status(200).json(moves)
  } catch (error) {
    console.error('Error getting user moves:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export {
  getAllMoves,
  getMoveById,
  getGameMoves,
  getUserMoves
}
