'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.createTable('user_settings', {
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
    theme: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      defaultValue: 'light',
      comment: 'Tema visual preferido'
    },
    notifications_enabled: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Si las notificaciones están activadas'
    },
    sound_enabled: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Si los efectos de sonido están activados'
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW
    }
  });
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('user_settings');
}
