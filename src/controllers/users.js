import User from '../factory/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../environment.js'
import uuid4 from 'uuid4'


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

// LOGIN POST - Regular login with email and password
export const login = async (req, res) => {
  try {
    // Verificar si es un login de Google
    if (req.body.google_id) {
      return handleGoogleLogin(req, res);
    }
    
    // Login tradicional con email y password
    const user = await User.login(req.body.email)

    if (!user || user?.email !== req.body.email) {
      return res.status(422).json({
        message: 'Invalid Email'
      })
    }
    
    // Verificar si el usuario tiene password_hash para autenticación normal
    if (user.password_hash && req.body.password) {
      const passMatch = await bcrypt.compare(req.body.password, user.password_hash)
      if (!passMatch) {
        return res.status(422).json({
          message: 'Incorrect password'
        })
      }
    } else {
      return res.status(422).json({
        message: 'Authentication method not available for this user'
      })
    }
    
    // Actualizar último login
    await User.updateItem({ 
      id: user.id, 
      last_login_at: new Date() 
    })
    
    const token = jwt.sign({ id: user.id }, env.SECRET_KEY, { expiresIn: '24h' })
    return res.json({
      token,
      user
    })
  } catch (e) {
    return res.status(409).json(e)
  }
}

// Función para manejar login con Google
const handleGoogleLogin = async (req, res) => {
  try {
    // Buscar si existe el usuario con ese email
    let user = await User.login(req.body.email);
    
    if (user) {
      // Si el usuario existe, actualizar sus datos de Google
      await User.updateItem({
        id: user.id,
        google_id: req.body.google_id,
        photo_url: req.body.photo_url || user.photo_url,
        google_name: req.body.google_name || user.google_name,
        last_login_at: new Date()
      });
    } else {
      // Si el usuario no existe, crearlo
      user = await User.createItem({
        id: uuid4(),
        google_id: req.body.google_id,
        google_name: req.body.google_name,
        email: req.body.email,
        photo_url: req.body.photo_url || null,
        // role field has been removed
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: new Date()
      });
    }
    
    // Obtener el usuario actualizado
    user = await User.getItemEmail(req.body.email);
    
    // Generar token de autenticación
    const token = jwt.sign({ id: user.id }, env.SECRET_KEY, { expiresIn: '24h' });
    
    return res.json({
      token,
      user
    });
  } catch (e) {
    return res.status(409).json(e);
  }
}
