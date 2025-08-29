import { Router } from 'express'
import { body } from 'express-validator'
import {
  getAll,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  deleteAll,
  login
} from '../controllers/users.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'

const router = Router()

router.get('/', getAll)

router.get('/:id', validateToken, getItem)

router.post('/', [
  body([
    'email',
    'name'
  ], 'field is required.').notEmpty().escape().trim().isLength({ min: 3 })
], validateFields, validateToken, createItem)

router.put('/', validateToken, updateItem)

router.delete('/', validateToken, deleteItem)

router.delete('/all', validateToken, deleteAll)

// Login regular (email + password)
router.post('/login', [
  body('email', 'Invalid Email')
    .notEmpty()
    .trim(),
  body('password', 'The Password must be of minimum 4 characters length')
    .notEmpty()
    .trim()
    .isLength({ min: 4 })
], validateFields, login)

// Login con Google (no requiere password)
router.post('/google-login', [
  body('email', 'Invalid Email')
    .notEmpty()
    .trim()
    .isEmail(),
  body('google_id', 'Google ID is required')
    .notEmpty()
    .trim(),
  body('name', 'Name is required')
    .notEmpty()
    .trim()
], validateFields, login)

export default router
