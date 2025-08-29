import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/sequelize.js'

class GameMove extends Model {
  static associate(models) {
    GameMove.belongsTo(models.Game, { foreignKey: 'game_id' });
    GameMove.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

GameMove.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  game_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'games',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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
  position_x: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Coordenada X en el tablero'
  },
  position_y: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Coordenada Y en el tablero'
  },
  move_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número de orden del movimiento'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'GameMove',
  tableName: 'game_moves',
  underscored: true,
  timestamps: false
})

export default GameMove
