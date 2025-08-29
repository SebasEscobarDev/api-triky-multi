/* eslint-disable camelcase */
import UserModel from '../models/User.js'
import bcrypt from 'bcryptjs'
import uuid4 from 'uuid4'

const ARRAY_ATTRIBUTES = [
  'id',
  'google_id',
  'email',
  'google_name',
  'photo_url',
  'custom_name',
  'custom_photo_url',
  'created_at',
  'updated_at',
  'last_login_at'
  // 'password_hash' se oculta por seguridad
]

const DATE_COLOMBIA = new Date(new Date().setHours(new Date().getHours() - 5))

class User {
  async login(email) {
    return await UserModel.findOne({
      where: { email },
      raw: true
    })
  }

  async getAll({ results, page, id }) {
    return await UserModel.findAndCountAll({
      ...(id && { where: { id } }),
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['updated_at', 'ASC']
      ],
      attributes: ARRAY_ATTRIBUTES,
    })
  }

  async getItem(id) {
    return await UserModel.findByPk(id, {
      attributes: ARRAY_ATTRIBUTES, raw: true
    })
  }

  async getItemEmail(email) {
    return await UserModel.findOne({
      where: { email },
      attributes: ARRAY_ATTRIBUTES,
      raw: true
    })
  }

  async deleteItem(id) {
    return await UserModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await UserModel.truncate();
  }


  async createItem(body) {
    const userData = {
      id: uuid4(),
      google_id: body.google_id || null,
      email: body.email,
      google_name: body.google_name,
      photo_url: body.photo_url || null,
      custom_name: body.custom_name || null,
      custom_photo_url: body.custom_photo_url || null,
      created_at: DATE_COLOMBIA,
      updated_at: DATE_COLOMBIA
    };

    // Sólo crear password_hash si se proporciona una contraseña
    if (body.password) {
      userData.password_hash = await bcrypt.hash(body.password, 12);
    }

    return await UserModel.create(userData, {
      attributes: ARRAY_ATTRIBUTES,
      raw: true
    });
  }

  async updateItem(body) {
    const updateInfo = {
      ...body,
      updated_at: DATE_COLOMBIA
    };

    // Si se proporciona una contraseña, generar el hash
    if (body.password) {
      updateInfo.password_hash = await bcrypt.hash(body.password, 12);
      delete updateInfo.password; // Eliminar la contraseña sin hash
    }

    const [rowsUpdated] = await UserModel.update(updateInfo, {
      where: { id: body.id },
    });

    return rowsUpdated ? this.getItem(body.id) : null;
  }
}

export default User
