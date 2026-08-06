const express = require('express');
const { verificarToken, permitirRoles } = require('../middlewares/auth');
const {
  crearTicket,
  misTickets,
  ticketsAsignados,
  actualizarEstado,
  registrarSolucion,
  listarTickets,
  asignarTecnico,
  eliminarTicket,
  historialTicket,
  obtenerTicketPorId,
  actualizarTicket
} = require('../controllers/ticketController');

const router = express.Router();

router.post('/', verificarToken, permitirRoles('USUARIO'), crearTicket);
router.get('/mios', verificarToken, permitirRoles('USUARIO'), misTickets);
router.get('/asignados', verificarToken, permitirRoles('TECNICO'), ticketsAsignados);
router.get('/', verificarToken, permitirRoles('ADMINISTRADOR'), listarTickets);
router.get('/:id', verificarToken, obtenerTicketPorId);
router.put('/:id', verificarToken, permitirRoles('ADMINISTRADOR', 'TECNICO', 'USUARIO'), actualizarTicket);
router.put('/:id/estado', verificarToken, permitirRoles('TECNICO'), actualizarEstado);
router.put('/:id/solucion', verificarToken, permitirRoles('TECNICO'), registrarSolucion);
router.put('/:id/asignar', verificarToken, permitirRoles('ADMINISTRADOR'), asignarTecnico);
router.delete('/:id', verificarToken, permitirRoles('ADMINISTRADOR'), eliminarTicket);
router.get('/:id/historial', verificarToken, historialTicket);

module.exports = router;
