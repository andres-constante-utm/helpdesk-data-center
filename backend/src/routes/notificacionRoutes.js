const express = require('express');
const { verificarToken } = require('../middlewares/auth');
const { listarNotificaciones, marcarLeida } = require('../controllers/notificacionController');

const router = express.Router();

router.get('/', verificarToken, listarNotificaciones);
router.put('/:id/leer', verificarToken, marcarLeida);

module.exports = router;
