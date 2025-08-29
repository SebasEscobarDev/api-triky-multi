import express from 'express'
import { body, param } from 'express-validator'
import { validateFields } from '../middlewares/validateFields.js'
import { validateToken } from '../middlewares/validateToken.js'
import {
  getUserSettings,
  updateUserSettings,
  getAllSettings,
  getSettingsById,
  getUserSettingsById
} from '../controllers/user-settings.js'

const router = express.Router()

// All routes require authentication
router.use(validateToken)

// Get settings for authenticated user
router.get('/me', getUserSettings)

// Update settings for authenticated user
router.put('/me',
  body('theme').optional().isString().withMessage('El tema debe ser un texto válido'),
  body('notifications_enabled').optional().isBoolean().withMessage('notifications_enabled debe ser un valor booleano'),
  body('sound_enabled').optional().isBoolean().withMessage('sound_enabled debe ser un valor booleano'),
  validateFields,
  updateUserSettings
)

// Get all settings (admin function)
router.get('/', getAllSettings)

// Get settings by ID
router.get('/:id',
  param('id').isUUID().withMessage('ID de configuración inválido'),
  validateFields,
  getSettingsById
)

// Get settings for specific user
router.get('/user/:userId',
  param('userId').isUUID().withMessage('ID de usuario inválido'),
  validateFields,
  getUserSettingsById
)

export default router
