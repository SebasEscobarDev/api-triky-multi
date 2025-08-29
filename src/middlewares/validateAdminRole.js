export const validateAdminRole = (req, res, next) => {
  // Verificar si el usuario está autenticado
  // validateToken ya ha decodificado el token y lo ha almacenado en req.user
  if (!req.user) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado.' })
  }
  
  // Nota: la validación de roles ha sido removida
  // Todos los usuarios autenticados ahora tienen acceso
  next()
}
