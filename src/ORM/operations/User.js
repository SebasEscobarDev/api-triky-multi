/* eslint-disable camelcase */
import UserModel from '../models/User.js'
import moment from 'moment'
import bcrypt from 'bcryptjs'
import uuid4 from 'uuid4'

const ARRAY_ATTRIBUTES = [
  'id',
  'email',
  // 'password', hide this field
  'name',
  'lastname',
  'birth_date',
  'genre_id',
  'created_at',
  'updated_at'
]

const formatDate = () => moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss');

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
    const hashPass = await bcrypt.hash(body.password, 12)
    return await UserModel.create({
      id: uuid4(),
      email: body.email,
      password: hashPass,
      created_at: formatDate(),
      updated_at: formatDate(),
    },
      {
        attributes: ARRAY_ATTRIBUTES,
        raw: true
      }
    )
  }

  async updateItem(body) {
    const updated_at = formatDate();
    if (body.password) body.password = await bcrypt.hash(body.password, 12);

    const updateInfo = {
      ...body,
      updated_at,
    };

    const [rowsUpdated] = await UserModel.update(updateInfo, {
      where: { id: body.id },
    });

    return rowsUpdated ? this.getItem(body.id) : null;
  }
}

export default User
