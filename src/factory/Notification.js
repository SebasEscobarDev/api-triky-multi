import NotificationService from '../services/Notification.js'

class NotificationFactory {
  constructor() {
    this.service = new NotificationService()
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new NotificationFactory()
    }
    return this._instance
  }

  static getAll(options) {
    return this.instance.service.getAll(options)
  }

  static getById(id) {
    return this.instance.service.getById(id)
  }

  static getByUserId(userId, options) {
    return this.instance.service.getByUserId(userId, options)
  }

  static createNotification(data) {
    return this.instance.service.createNotification(data)
  }

  static markAsRead(id) {
    return this.instance.service.markAsRead(id)
  }

  static markAllAsRead(userId) {
    return this.instance.service.markAllAsRead(userId)
  }

  static deleteNotification(id) {
    return this.instance.service.deleteNotification(id)
  }

  static deleteAllUserNotifications(userId) {
    return this.instance.service.deleteAllUserNotifications(userId)
  }

  static createGameInviteNotification(userId, gameId, inviterName) {
    return this.instance.service.createGameInviteNotification(userId, gameId, inviterName)
  }

  static createTurnNotification(userId, gameId) {
    return this.instance.service.createTurnNotification(userId, gameId)
  }

  static createGameResultNotification(userId, gameId, result) {
    return this.instance.service.createGameResultNotification(userId, gameId, result)
  }
}

export default NotificationFactory
