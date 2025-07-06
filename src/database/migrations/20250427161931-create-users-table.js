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
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 255]
      }
    },
    role: Sequelize.DataTypes.ENUM('admin', 'empleado'),
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    birth_date: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    genre_id: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    updated_at: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
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
