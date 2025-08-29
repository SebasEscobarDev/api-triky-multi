import UserSettingFactory from '../factory/UserSetting.js'

const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.id
    let settings = await UserSettingFactory.getByUserId(userId)
    
    if (!settings) {
      // Create default settings if none exist
      settings = await UserSettingFactory.createOrUpdateSettings(userId, {
        theme: 'light',
        notifications_enabled: true,
        sound_enabled: true
      })
    }
    
    return res.status(200).json(settings)
  } catch (error) {
    console.error('Error getting user settings:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id
    const { theme, notifications_enabled, sound_enabled } = req.body
    
    const settings = await UserSettingFactory.createOrUpdateSettings(userId, {
      theme,
      notifications_enabled,
      sound_enabled
    })
    
    return res.status(200).json(settings)
  } catch (error) {
    console.error('Error updating user settings:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getAllSettings = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query
    const options = { limit: parseInt(limit), offset: parseInt(offset) }
    const result = await UserSettingFactory.getAll(options)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Error getting all settings:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getSettingsById = async (req, res) => {
  try {
    const { id } = req.params
    const settings = await UserSettingFactory.getById(id)
    
    if (!settings) {
      return res.status(404).json({ message: 'Configuración no encontrada' })
    }
    
    return res.status(200).json(settings)
  } catch (error) {
    console.error('Error getting settings by ID:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getUserSettingsById = async (req, res) => {
  try {
    const { userId } = req.params
    const settings = await UserSettingFactory.getByUserId(userId)
    
    if (!settings) {
      return res.status(404).json({ message: 'Configuración no encontrada para este usuario' })
    }
    
    return res.status(200).json(settings)
  } catch (error) {
    console.error('Error getting user settings by ID:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export {
  getUserSettings,
  updateUserSettings,
  getAllSettings,
  getSettingsById,
  getUserSettingsById
}
