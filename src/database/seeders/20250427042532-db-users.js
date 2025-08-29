'use strict';

import bcrypt from 'bcryptjs';
import uuid4 from 'uuid4';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const DATE_COLOMBIA = new Date(new Date().setHours(new Date().getHours() - 5))
  const passwordHash = await bcrypt.hash('Qaws12pj-22', 10);

  // Check if users already exist to avoid duplicate email error
  const existingUsers = await queryInterface.sequelize.query(
    'SELECT email FROM users',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const existingEmails = existingUsers.map(user => user.email);
  
  const usersToInsert = [];
  
  // Only add users if they don't already exist
  if (!existingEmails.includes('admin@correo.com')) {
    usersToInsert.push({
      id: uuid4(),
      google_name: 'Admin',
      email: 'admin@correo.com',
      password_hash: passwordHash,
      created_at: DATE_COLOMBIA,
      updated_at: DATE_COLOMBIA,
      last_login_at: DATE_COLOMBIA
    });
  }
  
  if (!existingEmails.includes('empleado1@correo.com')) {
    usersToInsert.push({
      id: uuid4(),
      google_name: 'Empleado 1',
      email: 'empleado1@correo.com',
      password_hash: passwordHash,
      created_at: DATE_COLOMBIA,
      updated_at: DATE_COLOMBIA,
      last_login_at: DATE_COLOMBIA
    });
  }
  
  if (usersToInsert.length > 0) {
    await queryInterface.bulkInsert('users', usersToInsert, {});
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('users', null, {});
}
