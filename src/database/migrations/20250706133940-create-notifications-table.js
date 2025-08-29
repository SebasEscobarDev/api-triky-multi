'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.createTable('notifications', {
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
    message: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
      comment: 'Mensaje de la notificación'
    },
    type: {
      type: Sequelize.DataTypes.ENUM('game_invite', 'turn', 'result', 'system'),
      allowNull: false,
      defaultValue: 'system',
      comment: 'Tipo de notificación'
    },
    read: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si la notificación ha sido leída'
    },
    action_url: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      comment: 'URL de acción opcional'
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW
    }
  });
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('notifications');
}
