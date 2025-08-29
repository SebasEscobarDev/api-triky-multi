'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.createTable('games', {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
    },
    player1_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    player2_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    current_player_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'ID del jugador que tiene el turno actual'
    },
    board_state: {
      type: Sequelize.DataTypes.JSON,
      allowNull: false,
      defaultValue: JSON.stringify(Array(9).fill(null)),
      comment: 'Estado del tablero en formato JSON'
    },
    winner_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'ID del ganador, si lo hay'
    },
    is_draw: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indica si el juego terminó en empate'
    },
    status: {
      type: Sequelize.DataTypes.ENUM('active', 'completed', 'abandoned'),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Estado actual del juego'
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW
    },
    completed_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de finalización del juego'
    }
  });
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('games');
}
