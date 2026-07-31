const jwt = require('jsonwebtoken');

// Valida el token JWT del header Authorization y adjunta los datos del usuario a req.usuario
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autenticado: token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'No autenticado: token inválido o expirado' });
  }
}

// Middleware factory: permite el acceso solo a los roles indicados
function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tiene permiso para realizar esta acción' });
    }
    next();
  };
}

module.exports = { verificarToken, permitirRoles };
