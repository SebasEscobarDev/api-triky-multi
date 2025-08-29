import express from 'express'
import { body, param, query } from 'express-validator'
import { validateFields } from '../middlewares/validateFields.js'
import { validateToken } from '../middlewares/validateToken.js'
import {
  getAllNotifications,
  getNotificationById,
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllUserNotifications
} from '../controllers/notifications.js'

const router = express.Router()

// All routes require authentication
router.use(validateToken)

// Get all notifications (admin function)
router.get('/', getAllNotifications)

// Get a specific notification by ID
router.get('/:id',
  param('id').isUUID().withMessage('ID de notificación inválido'),
  validateFields,
  getNotificationById
)

// Get all notifications for authenticated user
router.get('/user/me',
  query('read').optional().isBoolean().withMessage('El valor de read debe ser booleano'),
  query('type').optional().isIn(['game_invite', 'turn', 'result', 'system']).withMessage('Tipo de notificación inválido'),
  validateFields,
  getUserNotifications
)

// Create a new notification
router.post('/',
  body('user_id').isUUID().withMessage('ID de usuario inválido'),
  body('message').notEmpty().withMessage('El mensaje es obligatorio'),
  body('type').isIn(['game_invite', 'turn', 'result', 'system']).withMessage('Tipo de notificación inválido'),
  body('action_url').optional(),
  validateFields,
  createNotification
)

// Mark a notification as read
router.put('/:id/read',
  param('id').isUUID().withMessage('ID de notificación inválido'),
  validateFields,
  markNotificationAsRead
)

// Mark all notifications as read
router.put('/user/me/read', markAllNotificationsAsRead)

// Delete a specific notification
router.delete('/:id',
  param('id').isUUID().withMessage('ID de notificación inválido'),
  validateFields,
  deleteNotification
)

// Delete all notifications for authenticated user
router.delete('/user/me', deleteAllUserNotifications)

export default router
