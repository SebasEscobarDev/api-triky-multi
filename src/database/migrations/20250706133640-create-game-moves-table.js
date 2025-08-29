'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.createTable('game_moves', {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
    },
    game_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    position_x: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      comment: 'Coordenada X en el tablero'
    },
    position_y: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      comment: 'Coordenada Y en el tablero'
    },
    move_number: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      comment: 'Número de orden del movimiento'
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW
    }
  });
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('game_moves');
}
