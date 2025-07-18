import User from '../factory/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../environment.js'


export const getAll = async (req, res, next) => {
  const options = {
    results: req.query.results ? parseInt(req.query.results, 10) : 10,
    page: req.query.page ? parseInt(req.query.page, 10) : 1
  }
  try {
    const { rows } = await User.getAll(options)
    const lastPage = Math.ceil(rows.length / options.results)
    const response = {
      count: rows.length,
      page: options.page,
      perPage: options.results,
      lastPage,
      rows,
    }
    return res.status(200).json(response)
  } catch (e) {
    return res.status(409).json(e)
  }
}


export const getItem = async (req, res, next) => {
  try {
    const item = await User.getItem(req.params.id)
    return res.status(200).json(item)
  } catch (e) {
    return res.status(409).json(e)
  }
}

export const createItem = async (req, res, next) => {
  try {
    const item = await User.createItem(req.body)
    const token = jwt.sign({ id: item.id }, env.SECRET_KEY, { expiresIn: '24h' })
    return res.status(201).json({
      token,
      user: item
    })
  } catch (e) {
    return res.status(409).json(e)
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const item = await User.updateItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    return res.status(409).json(e)
  }
}

export const deleteItem = async (req, res, next) => {
  try {
    const item = await User.deleteItem(req.body.id)
    const response = item ? 'Registro eliminado' : 'No se pudo eliminar'
    return res.status(200).json(response)
  } catch (e) {
    return res.status(409).json(e)
  }
}

export const deleteAll = async (req, res, next) => {
  try {
    const response = await User.deleteAll()
    return res.status(200).json(response)
  } catch (e) {
    return res.status(409).json(e)
  }
}

// LOGIN POST
export const login = async (req, res) => {
  try {
    const user = await User.login(req.body.email)

    if (user?.email !== req.body.email) {
      return res.status(422).json({
        message: 'Invalid Email'
      })
    }
    const passMatch = await bcrypt.compare(req.body.password, user.password)
    if (!passMatch) {
      return res.status(422).json({
        message: 'Incorrect password'
      })
    }
    // const token = jwt.sign({ id: user.id }, env.SECRET_KEY, { expiresIn: '24h' })
    console.log("env.SECRET_KEY")
    console.log(env.SECRET_KEY)
    console.log("------------------")
    const token = jwt.sign({ id: user.id, role: user.role }, env.SECRET_KEY, { expiresIn: '24h' })
    return res.json({
      token,
      user
    })
  } catch (e) {
    return res.status(409).json(e)
  }
}
