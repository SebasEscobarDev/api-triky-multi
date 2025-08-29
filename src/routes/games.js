import express from 'express'
import { body, param } from 'express-validator'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
import {
  getAllGames,
  getGameById,
  getUserGames,
  createGame,
  updateGame,
  deleteGame,
  deleteAllUserGames,
  makeMove
} from '../controllers/games.js'

const router = express.Router()

// Apply JWT validation to all game routes
router.use(validateToken)

// Get all games
router.get('/', getAllGames)

// Get specific game by ID
router.get('/:id',
  param('id').isUUID().withMessage('ID de juego inválido'),
  validateFields,
  getGameById
)

// Get all games for authenticated user
router.get('/user/me', getUserGames)

// Create a new game
router.post('/',
  body('player2_id').isUUID().withMessage('ID de jugador inválido'),
  validateFields,
  createGame
)

// Update game status
router.put('/:id',
  param('id').isUUID().withMessage('ID de juego inválido'),
  body('status').isIn(['active', 'completed', 'abandoned']).withMessage('Estado de juego inválido'),
  validateFields,
  updateGame
)

// Delete specific game
router.delete('/:id',
  param('id').isUUID().withMessage('ID de juego inválido'),
  validateFields,
  deleteGame
)

// Delete all games for authenticated user
router.delete('/user/me', deleteAllUserGames)

// Make a move in a game
router.post('/:id/move',
  param('id').isUUID().withMessage('ID de juego inválido'),
  body('position').isInt({ min: 0, max: 8 }).withMessage('Posición inválida (debe ser entre 0-8)'),
  validateFields,
  makeMove
)

export default router
