import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/sequelize.js'

class Ranking extends Model {
  static associate(models) {
    Ranking.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

Ranking.init({
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
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Puntos totales acumulados'
  },
  wins: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Número de victorias'
  },
  losses: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Número de derrotas'
  },
  draws: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Número de empates'
  },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Posición en el ranking'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Ranking',
  tableName: 'rankings',
  underscored: true,
  timestamps: false
})

export default Ranking
