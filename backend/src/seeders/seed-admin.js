const { sequelize, Usuario, Rol } = require('../models');

async function seedAdmin() {
  await sequelize.sync();

  const rolAdmin = await Rol.findOne({ where: { nombre: 'ADMINISTRADOR' } });
  if (!rolAdmin) {
    console.error('No existe el rol ADMINISTRADOR. Corre primero seed.js');
    await sequelize.close();
    process.exit(1);
  }

  const existente = await Usuario.findOne({ where: { correo: 'admin@helpdesk.utm.edu.ec' } });
  if (existente) {
    console.log('El usuario administrador ya existe.');
    await sequelize.close();
    process.exit(0);
  }

  await Usuario.create({
    nombre_completo: 'Administrador Help Desk',
    correo: 'admin@helpdesk.utm.edu.ec',
    password_hash: 'Admin2026!',
    rol_id: rolAdmin.id
  });

  console.log('Usuario administrador creado: admin@helpdesk.utm.edu.ec / Admin2026!');
  await sequelize.close();
  process.exit(0);
}

seedAdmin();
