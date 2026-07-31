require('dotenv').config();
const {
  sequelize,
  Rol,
  Categoria,
  Prioridad,
  EstadoTicket
} = require('../models');

// Sincroniza la base de datos y carga los datos base del sistema
async function seed() {
  try {
    await sequelize.sync();

    await Rol.bulkCreate([
      { nombre: 'USUARIO' },
      { nombre: 'TECNICO' },
      { nombre: 'ADMINISTRADOR' }
    ], { ignoreDuplicates: true });

    await Categoria.bulkCreate([
      { nombre: 'Red', descripcion: 'Incidentes relacionados con conectividad y red' },
      { nombre: 'Hardware', descripcion: 'Incidentes relacionados con equipos físicos' },
      { nombre: 'Software', descripcion: 'Incidentes relacionados con programas y sistemas' }
    ], { ignoreDuplicates: true });

    await Prioridad.bulkCreate([
      { nombre: 'Alta', nivel: 3 },
      { nombre: 'Media', nivel: 2 },
      { nombre: 'Baja', nivel: 1 }
    ], { ignoreDuplicates: true });

    await EstadoTicket.bulkCreate([
      { nombre: 'Abierto', descripcion: 'Ticket creado, pendiente de atención' },
      { nombre: 'En Progreso', descripcion: 'Ticket en atención por un técnico' },
      { nombre: 'Cerrado', descripcion: 'Ticket resuelto y cerrado' }
    ], { ignoreDuplicates: true });

    console.log('Seed completado: roles, categorías, prioridades y estados de ticket cargados.');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar el seed:', error);
    process.exit(1);
  }
}

seed();
