import NotificationFactory from '../factory/Notification.js'

const getAllNotifications = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query
    const options = { limit: parseInt(limit), offset: parseInt(offset) }
    const result = await NotificationFactory.getAll(options)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Error getting all notifications:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params
    const notification = await NotificationFactory.getById(id)
    
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' })
    }
    
    // Check if the notification belongs to the authenticated user
    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta notificación' })
    }
    
    return res.status(200).json(notification)
  } catch (error) {
    console.error('Error getting notification by ID:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    const { read, type, limit = 10, offset = 0 } = req.query
    
    const options = { 
      limit: parseInt(limit), 
      offset: parseInt(offset)
    }
    
    if (read !== undefined) {
      options.read = read === 'true'
    }
    
    if (type) {
      options.type = type
    }
    
    const notifications = await NotificationFactory.getByUserId(userId, options)
    return res.status(200).json(notifications)
  } catch (error) {
    console.error('Error getting user notifications:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const createNotification = async (req, res) => {
  try {
    const { user_id, message, type, action_url } = req.body
    
    const notification = await NotificationFactory.createNotification({
      user_id,
      message,
      type,
      action_url
    })
    
    return res.status(201).json(notification)
  } catch (error) {
    console.error('Error creating notification:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    
    // Check if the notification belongs to the user
    const notification = await NotificationFactory.getById(id)
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' })
    }
    
    if (notification.user_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para marcar esta notificación como leída' })
    }
    
    const updatedNotification = await NotificationFactory.markAsRead(id)
    return res.status(200).json(updatedNotification)
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id
    await NotificationFactory.markAllAsRead(userId)
    return res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    
    // Check if the notification belongs to the user
    const notification = await NotificationFactory.getById(id)
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' })
    }
    
    if (notification.user_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta notificación' })
    }
    
    await NotificationFactory.deleteNotification(id)
    return res.status(200).json({ message: 'Notificación eliminada correctamente' })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const deleteAllUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    await NotificationFactory.deleteAllUserNotifications(userId)
    return res.status(200).json({ message: 'Todas las notificaciones eliminadas correctamente' })
  } catch (error) {
    console.error('Error deleting all user notifications:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export {
  getAllNotifications,
  getNotificationById,
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllUserNotifications
}
