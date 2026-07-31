require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

// Sincroniza los modelos con la base de datos y levanta el servidor
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor Help Desk escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });
