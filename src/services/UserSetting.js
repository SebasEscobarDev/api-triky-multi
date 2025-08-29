import uuid4 from 'uuid4'
import { UserSetting, User } from '../models/associations.js'

class UserSettingService {
  constructor() {
    this.model = UserSetting
    this.attributes = ['id', 'user_id', 'theme', 'notifications_enabled', 'sound_enabled', 'updated_at']
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
      queryOptions.order = [['updated_at', 'DESC']]
    }

    return this.model.findAndCountAll(queryOptions)
  }

  async getById(id) {
    return this.model.findByPk(id, {
      attributes: this.attributes,
      include: this.include
    })
  }

  async getByUserId(userId) {
    return this.model.findOne({
      where: { user_id: userId },
      attributes: this.attributes,
      include: this.include
    })
  }

  async createOrUpdateSettings(userId, data) {
    let settings = await this.getByUserId(userId)
    const now = new Date()
    
    if (!settings) {
      // Create default settings for the user
      settings = await this.model.create({
        id: uuid4(),
        user_id: userId,
        theme: data.theme || 'light',
        notifications_enabled: data.notifications_enabled !== undefined ? data.notifications_enabled : true,
        sound_enabled: data.sound_enabled !== undefined ? data.sound_enabled : true,
        updated_at: now
      })
    } else {
      // Update existing settings
      const updateData = {
        updated_at: now
      }
      
      if (data.theme !== undefined) updateData.theme = data.theme
      if (data.notifications_enabled !== undefined) updateData.notifications_enabled = data.notifications_enabled
      if (data.sound_enabled !== undefined) updateData.sound_enabled = data.sound_enabled
      
      await settings.update(updateData)
    }
    
    return this.getByUserId(userId)
  }
}

export default UserSettingService
