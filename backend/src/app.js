const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/tickets', ticketRoutes);
app.use('/notificaciones', notificacionRoutes);

module.exports = app;
