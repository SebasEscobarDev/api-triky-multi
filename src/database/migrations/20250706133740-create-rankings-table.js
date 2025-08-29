'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.createTable('rankings', {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    points: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Puntos totales acumulados'
    },
    wins: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Número de victorias'
    },
    losses: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Número de derrotas'
    },
    draws: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Número de empates'
    },
    rank: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Posición en el ranking'
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW
    }
  });
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('rankings');
}
