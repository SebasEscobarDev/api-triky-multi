export const validateAdminRole = (req, res, next) => {
  // Verificar si el usuario es administrador
  // validateToken ya ha decodificado el token y lo ha almacenado en req.user
  if (!req.user) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado.' })
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      mensaje: 'Acceso denegado. Se requieren permisos de administrador para esta operación.' 
    })
  }
  
  // Si el usuario es administrador, permitir continuar
  next()
}
