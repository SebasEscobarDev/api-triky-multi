import UserSettingService from '../services/UserSetting.js'

class UserSettingFactory {
  constructor() {
    this.service = new UserSettingService()
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new UserSettingFactory()
    }
    return this._instance
  }

  static getAll(options) {
    return this.instance.service.getAll(options)
  }

  static getById(id) {
    return this.instance.service.getById(id)
  }

  static getByUserId(userId) {
    return this.instance.service.getByUserId(userId)
  }

  static createOrUpdateSettings(userId, data) {
    return this.instance.service.createOrUpdateSettings(userId, data)
  }
}

export default UserSettingFactory
