import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/sequelize.js'

class Game extends Model {
  static associate(models) {
    Game.belongsTo(models.User, { foreignKey: 'player1_id', as: 'player1' });
    Game.belongsTo(models.User, { foreignKey: 'player2_id', as: 'player2' });
    Game.belongsTo(models.User, { foreignKey: 'current_player_id', as: 'currentPlayer' });
    Game.belongsTo(models.User, { foreignKey: 'winner_id', as: 'winner' });
    Game.hasMany(models.GameMove, { foreignKey: 'game_id' });
  }
}

Game.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  player1_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  player2_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  current_player_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'ID del jugador que tiene el turno actual'
  },
  board_state: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: JSON.stringify(Array(9).fill(null)),
    comment: 'Estado del tablero en formato JSON'
  },
  winner_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'ID del ganador, si lo hay'
  },
  is_draw: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Indica si el juego terminó en empate'
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'abandoned'),
    allowNull: false,
    defaultValue: 'active',
    comment: 'Estado actual del juego'
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
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de finalización del juego'
  }
}, {
  sequelize,
  modelName: 'Game',
  tableName: 'games',
  underscored: true,
  timestamps: false
})

export default Game
