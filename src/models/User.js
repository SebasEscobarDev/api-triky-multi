import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/sequelize.js'

class User extends Model {
  static associate(models) {
    User.hasMany(models.Sale, { foreignKey: 'user_id' });
  }
}
User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 255]
    }
  },
  role: DataTypes.ENUM('admin', 'empleado'),
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birth_date: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genre_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.STRING,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  underscored: true,
  timestamps: false
})

export default User
