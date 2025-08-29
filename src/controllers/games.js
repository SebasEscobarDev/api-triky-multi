import GameFactory from '../factory/Game.js'

const getAllGames = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query
    const options = { limit: parseInt(limit), offset: parseInt(offset) }
    const result = await GameFactory.getAll(options)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Error getting all games:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getGameById = async (req, res) => {
  try {
    const { id } = req.params
    const game = await GameFactory.getById(id)
    
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' })
    }
    
    return res.status(200).json(game)
  } catch (error) {
    console.error('Error getting game by ID:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getUserGames = async (req, res) => {
  try {
    const userId = req.user.id
    const games = await GameFactory.getByUserId(userId)
    return res.status(200).json(games)
  } catch (error) {
    console.error('Error getting user games:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const createGame = async (req, res) => {
  try {
    const { player2_id } = req.body
    const player1_id = req.user.id
    
    if (player1_id === player2_id) {
      return res.status(400).json({ message: 'No puedes crear un juego contigo mismo' })
    }
    
    const game = await GameFactory.createGame({
      player1_id,
      player2_id
    })
    
    return res.status(201).json(game)
  } catch (error) {
    console.error('Error creating game:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const updateGame = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user.id
    
    // Verify that the user is a participant
    const game = await GameFactory.getById(id)
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' })
    }
    
    if (game.player1_id !== userId && game.player2_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este juego' })
    }
    
    const updatedGame = await GameFactory.updateGame(id, { status })
    
    return res.status(200).json(updatedGame)
  } catch (error) {
    console.error('Error updating game:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    
    // Verify that the user is a participant
    const game = await GameFactory.getById(id)
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' })
    }
    
    if (game.player1_id !== userId && game.player2_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este juego' })
    }
    
    await GameFactory.deleteGame(id)
    
    return res.status(200).json({ message: 'Juego eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting game:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const deleteAllUserGames = async (req, res) => {
  try {
    const userId = req.user.id
    await GameFactory.deleteAllUserGames(userId)
    return res.status(200).json({ message: 'Todos los juegos del usuario han sido eliminados' })
  } catch (error) {
    console.error('Error deleting all user games:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const makeMove = async (req, res) => {
  try {
    const { id } = req.params
    const { position } = req.body
    const userId = req.user.id
    
    // Verify that the user is a participant and it's their turn
    const game = await GameFactory.getById(id)
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' })
    }
    
    if (game.player1_id !== userId && game.player2_id !== userId) {
      return res.status(403).json({ message: 'No eres participante de este juego' })
    }
    
    if (game.current_player_id !== userId) {
      return res.status(403).json({ message: 'No es tu turno' })
    }
    
    if (game.status !== 'active') {
      return res.status(400).json({ message: 'El juego ya no está activo' })
    }
    
    const updatedGame = await GameFactory.makeMove(id, userId, position)
    
    return res.status(200).json(updatedGame)
  } catch (error) {
    console.error('Error making move:', error)
    if (error.message === 'Position already taken' || error.message === 'Invalid position') {
      return res.status(400).json({ message: error.message })
    }
    if (error.message === 'Not your turn') {
      return res.status(403).json({ message: 'No es tu turno' })
    }
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export {
  getAllGames,
  getGameById,
  getUserGames,
  createGame,
  updateGame,
  deleteGame,
  deleteAllUserGames,
  makeMove
}
