import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/sequelize.js'

class User extends Model {
  static associate(models) {
    User.hasMany(models.Game, { foreignKey: 'player1_id', as: 'gamesAsPlayer1' });
    User.hasMany(models.Game, { foreignKey: 'player2_id', as: 'gamesAsPlayer2' });
    User.hasMany(models.Game, { foreignKey: 'current_player_id', as: 'gamesWithCurrentTurn' });
    User.hasMany(models.Game, { foreignKey: 'winner_id', as: 'wonGames' });
    User.hasMany(models.GameMove, { foreignKey: 'user_id' });
    User.hasOne(models.Ranking, { foreignKey: 'user_id' });
    User.hasOne(models.UserSetting, { foreignKey: 'user_id' });
    User.hasMany(models.Notification, { foreignKey: 'user_id' });
  }
}
User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  google_id: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'ID para autenticación Google'
  },
  google_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nombre obtenido de Google'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    comment: 'Email obtenido de Google'
  },
  photo_url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL de foto de Google'
  },
  custom_name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Nombre personalizado por el usuario'
  },
  custom_photo_url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL de foto personalizada'
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Hash de contraseña (opcional)'
  },

  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha del último inicio de sesión'
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  underscored: true,
  timestamps: false
})

export default User
