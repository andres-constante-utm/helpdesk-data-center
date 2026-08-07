const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');

const app = express();

const origenesPermitidos = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:4200'];

app.use(cors({
    origin: origenesPermitidos,
    credentials: true
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/tickets', ticketRoutes);
app.use('/notificaciones', notificacionRoutes);

module.exports = app;