'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  return queryInterface.createTable('users', {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
    },
    google_id: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      comment: 'ID para autenticación Google'
    },
    google_name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      comment: 'Nombre obtenido de Google'
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      comment: 'Email obtenido de Google'
    },
    photo_url: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      comment: 'URL de foto de Google'
    },
    custom_name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      comment: 'Nombre personalizado por el usuario'
    },
    custom_photo_url: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      comment: 'URL de foto personalizada'
    },
    password_hash: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      comment: 'Hash de contraseña (opcional)'
    },
    // role field removed
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
    last_login_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha del último inicio de sesión'
    },
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  return queryInterface.dropTable('users');
}
