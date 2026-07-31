const express = require('express');
const { verificarToken, permitirRoles } = require('../middlewares/auth');
const {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', verificarToken, permitirRoles('ADMINISTRADOR'), listarUsuarios);
router.post('/', verificarToken, permitirRoles('ADMINISTRADOR'), crearUsuario);
router.put('/:id', verificarToken, permitirRoles('ADMINISTRADOR'), actualizarUsuario);
router.delete('/:id', verificarToken, permitirRoles('ADMINISTRADOR'), eliminarUsuario);

module.exports = router;
