import express from 'express'
import { param } from 'express-validator'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
import {
  getAllMoves,
  getMoveById,
  getGameMoves,
  getUserMoves
} from '../controllers/game-moves.js'

const router = express.Router()

// Apply JWT validation to all move routes
router.use(validateToken)

// Get all moves (for admin purposes)
router.get('/', getAllMoves)

// Get specific move by ID
router.get('/:id',
  param('id').isUUID().withMessage('ID de movimiento inválido'),
  validateFields,
  getMoveById
)

// Get all moves for a specific game
router.get('/game/:gameId',
  param('gameId').isUUID().withMessage('ID de juego inválido'),
  validateFields,
  getGameMoves
)

// Get all moves for authenticated user
router.get('/user/me', getUserMoves)

export default router
