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
import { validateAdminRole } from '../middlewares/validateAdminRole.js'

const router = Router()

router.get('/', getAll)

router.get('/:id', validateToken, getItem)

router.post('/', [
  body([
    'email',
    'password'
  ], 'field is required.').notEmpty().escape().trim().isLength({ min: 3 })
], validateFields, validateToken, validateAdminRole, createItem)

router.put('/', validateToken, updateItem)

router.delete('/', validateToken, deleteItem)

router.delete('/all', validateToken, deleteAll)

router.post('/login', [
  body('email', 'Invalid Email Number')
    .notEmpty()
    .trim(),
  body('password', 'The Password must be of minimum 4 characters length')
    .notEmpty()
    .trim()
    .isLength({ min: 4 })
], validateFields, login)

export default router
