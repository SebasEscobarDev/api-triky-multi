import uuid4 from 'uuid4'
import { Notification, User } from '../models/associations.js'

class NotificationService {
  constructor() {
    this.model = Notification
    this.attributes = ['id', 'user_id', 'message', 'type', 'read', 'action_url', 'created_at']
    this.include = [
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

  async getByUserId(userId, options = {}) {
    const queryOptions = {
      where: { user_id: userId },
      attributes: this.attributes,
      include: this.include,
      order: [['created_at', 'DESC']]
    }

    if (options.read !== undefined) {
      queryOptions.where.read = options.read
    }

    if (options.type) {
      queryOptions.where.type = options.type
    }

    if (options.limit) {
      queryOptions.limit = options.limit
    }

    if (options.offset) {
      queryOptions.offset = options.offset
    }

    return this.model.findAll(queryOptions)
  }

  async createNotification(data) {
    const notificationData = {
      id: uuid4(),
      user_id: data.user_id,
      message: data.message,
      type: data.type || 'system',
      read: false,
      action_url: data.action_url,
      created_at: new Date()
    }

    return this.model.create(notificationData)
  }

  async markAsRead(id) {
    const notification = await this.getById(id)
    if (!notification) {
      throw new Error('Notificación no encontrada')
    }

    await notification.update({ read: true })
    return this.getById(id)
  }

  async markAllAsRead(userId) {
    await this.model.update(
      { read: true },
      { where: { user_id: userId, read: false } }
    )
    
    return this.getByUserId(userId)
  }

  async deleteNotification(id) {
    const notification = await this.getById(id)
    if (!notification) {
      throw new Error('Notificación no encontrada')
    }

    return notification.destroy()
  }

  async deleteAllUserNotifications(userId) {
    return this.model.destroy({
      where: { user_id: userId }
    })
  }

  async createGameInviteNotification(userId, gameId, inviterName) {
    return this.createNotification({
      user_id: userId,
      message: `${inviterName} te ha invitado a jugar una partida`,
      type: 'game_invite',
      action_url: `/games/${gameId}`
    })
  }

  async createTurnNotification(userId, gameId) {
    return this.createNotification({
      user_id: userId,
      message: 'Es tu turno para jugar',
      type: 'turn',
      action_url: `/games/${gameId}`
    })
  }

  async createGameResultNotification(userId, gameId, result) {
    return this.createNotification({
      user_id: userId,
      message: `Resultado de la partida: ${result}`,
      type: 'result',
      action_url: `/games/${gameId}`
    })
  }
}

export default NotificationService
