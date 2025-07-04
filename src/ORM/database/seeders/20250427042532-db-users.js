'use strict';

import bcrypt from 'bcryptjs';
import uuid4 from 'uuid4';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
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
      name: 'Admin',
      lastname: 'Principal',
      email: 'admin@correo.com',
      password: passwordHash,
      role: 'admin',
      genre_id: 1,
      birth_date: '1990-01-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  if (!existingEmails.includes('empleado1@correo.com')) {
    usersToInsert.push({
      id: uuid4(),
      name: 'Empleado 1',
      email: 'empleado1@correo.com',
      password: passwordHash,
      role: 'empleado'
    });
  }
  
  if (usersToInsert.length > 0) {
    await queryInterface.bulkInsert('users', usersToInsert, {});
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('users', null, {});
}
