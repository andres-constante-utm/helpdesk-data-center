# Help Desk Data Center — Backend API

API REST para el Sistema de Gestión de Incidentes de un Data Center, desarrollado como continuación de las Actividades 1, 3, 5 y 6 del proyecto `helpdesk-data-center` (UTM, Diseño de Software).

## Tecnologías

- Node.js v24
- Express 5
- Sequelize (ORM)
- SQLite3
- JSON Web Token (jsonwebtoken)
- bcrypt
- cors / dotenv

## Estructura del proyecto
backend/
├── db/
│ ├── helpdesk.sqlite
├── docs/
│ └── HelpDeskAPI.postman_collection.json
├── src/
│ ├── config/
│ │ └── database.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── notificacionController.js
│ │ ├── ticketController.js
│ │ └── usuarioController.js
│ ├── middlewares/
│ │ └── auth.js
│ ├── models/
│ │ ├── Categoria.js
│ │ ├── EstadoTicket.js
│ │ ├── HistorialTicket.js
│ │ ├── Notificacion.js
│ │ ├── PerfilTecnico.js
│ │ ├── Prioridad.js
│ │ ├── Rol.js
│ │ ├── Ticket.js
│ │ ├── Usuario.js
│ │ └── index.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── notificacionRoutes.js
│ │ ├── ticketRoutes.js
│ │ └── usuarioRoutes.js
│ └── seeders/
│ ├── seed-admin.js
│ └── seed.js
├── server.js
├── package.json
└── .env.example
## Modelo de datos

9 tablas: `roles`, `usuarios`, `categorias`, `prioridades`, `estados_ticket`, `perfiles_tecnicos`, `tickets`, `historial_tickets`, `notificaciones`.

Cada ticket queda relacionado con su categoría, prioridad, estado, el usuario que lo reporta y el técnico asignado. Los cambios de estado y las asignaciones de técnico generan automáticamente un registro de historial (auditoría) y, en el caso de la asignación, una notificación para el técnico.

## Roles del sistema

- **USUARIO**: reporta incidentes, consulta sus propios tickets.
- **TECNICO**: consulta sus tickets asignados, actualiza estado, registra la solución.
- **ADMINISTRADOR**: gestiona usuarios, asigna técnicos, consulta todos los tickets, elimina tickets.

## Instalación y ejecución

1. Instalar dependencias:
```bash
   npm install
```

2. Configurar variables de entorno (copiar el ejemplo y ajustar si es necesario):
```bash
   cp .env.example .env
```

3. Cargar los catálogos iniciales (roles, categorías, prioridades, estados):
```bash
   node src/seeders/seed.js
```

4. Crear el usuario administrador inicial:
```bash
   node src/seeders/seed-admin.js
```
   Credenciales generadas: `admin@helpdesk.utm.edu.ec` / `Admin2026!`

5. Levantar el servidor:
```bash
   node server.js
```
   El servidor queda disponible en `http://localhost:3000`.

## Endpoints principales

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | /auth/login | público | Autenticación, devuelve JWT |
| POST | /tickets | USUARIO | Crear ticket |
| GET | /tickets/mios | USUARIO | Tickets propios |
| GET | /tickets/asignados | TECNICO | Tickets asignados |
| PUT | /tickets/:id/estado | TECNICO | Actualizar estado |
| PUT | /tickets/:id/solucion | TECNICO | Registrar solución y cerrar |
| GET | /tickets | ADMINISTRADOR | Todos los tickets |
| PUT | /tickets/:id/asignar | ADMINISTRADOR | Asignar técnico |
| DELETE | /tickets/:id | ADMINISTRADOR | Eliminar ticket |
| GET | /tickets/:id/historial | autenticado | Historial del ticket |
| GET/POST/PUT/DELETE | /usuarios | ADMINISTRADOR | Gestión de usuarios |
| GET | /notificaciones | autenticado | Notificaciones propias |

## Pruebas

La colección de Postman con todas las pruebas documentadas se encuentra en `db/HelpDeskAPI.postman_collection.json`.

## Control de versiones

Desarrollado en la rama `feature/backend-api`, fusionada a `develop` mediante Gitflow.

## Andrés Gonzalo COnstante Murillo