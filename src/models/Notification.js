import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/sequelize.js'

class Notification extends Model {
  static associate(models) {
    Notification.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

Notification.init({
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
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Mensaje de la notificación'
  },
  type: {
    type: DataTypes.ENUM('game_invite', 'turn', 'result', 'system'),
    allowNull: false,
    defaultValue: 'system',
    comment: 'Tipo de notificación'
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Si la notificación ha sido leída'
  },
  action_url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL de acción opcional'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  underscored: true,
  timestamps: false
})

export default Notification
