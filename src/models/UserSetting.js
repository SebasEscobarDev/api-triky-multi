import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/sequelize.js'

class UserSetting extends Model {
  static associate(models) {
    UserSetting.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

UserSetting.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'light',
    comment: 'Tema visual preferido'
  },
  notifications_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Si las notificaciones están activadas'
  },
  sound_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Si los efectos de sonido están activados'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'UserSetting',
  tableName: 'user_settings',
  underscored: true,
  timestamps: false
})

export default UserSetting
