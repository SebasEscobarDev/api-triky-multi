import express from 'express'
import { param } from 'express-validator'
import { validateFields } from '../middlewares/validateFields.js'
import { validateToken } from '../middlewares/validateToken.js'
import {
  getAllRankings,
  getRankingById,
  getUserRanking,
  getSpecificUserRanking,
  getTopPlayers,
  recalculateAllRanks
} from '../controllers/rankings.js'

const router = express.Router()

// Public routes
router.get('/top', getTopPlayers)

// Protected routes
router.use(validateToken)

// Get all rankings
router.get('/', getAllRankings)

// Get specific ranking by ID
router.get('/:id',
  param('id').isUUID().withMessage('ID de ranking inválido'),
  validateFields,
  getRankingById
)

// Get current user's ranking
router.get('/user/me', getUserRanking)

// Get specific user's ranking
router.get('/user/:userId',
  param('userId').isUUID().withMessage('ID de usuario inválido'),
  validateFields,
  getSpecificUserRanking
)

// Recalculate all ranks (admin operation)
router.post('/recalculate', recalculateAllRanks)

export default router
