const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcryptjs');  // Usamos bcrypt para comparar las contraseñas
console.log('Estoy en server.js');
const app = express();
const port = 3000;

const connection = require('../model/config/db');  // Importar la conexión desde db.js

// Configura la conexión a la bd MySQL
/*const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Reemplaza con tu usuario de MySQL
  password: '',  // Reemplaza con tu contraseña de MySQL
  database:x| 'sistema_escolar'  // Nombre de tu base de datos
});
*/

// Middleware para manejar sesiones
app.use(session({
  secret: 'mi_secreto', // Cambia esto por algo más seguro
  resave: false,
  saveUninitialized: true
}));

// Middleware para parsear el body de las solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta para el inicio de sesión
app.post('/iniciar_sesion', (req, res) => {
  const { email, contraseña } = req.body;

  // Verificar si el usuario existe
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).send('Error en la base de datos');
    }

    if (results.length > 0) {
      const usuario = results[0];

      // Comparar la contraseña usando bcrypt
      bcrypt.compare(contraseña, usuario.contraseña, (err, isMatch) => {
        if (err) {
          return res.status(500).send('Error al verificar la contraseña');
        }

        if (isMatch) {
          // Usuario autenticado, guardar la sesión
          req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rango: usuario.rango
          };

          // Redirigir a la página principal (puedes cambiar esto por tu dashboard)
          res.redirect('/index');
        } else {
          res.status(401).send('Credenciales incorrectas');
        }
      });
    } else {
      res.status(401).send('Usuario no encontrado');
    }
  });
});

// Ruta para mostrar la página principal con el nombre del usuario
app.get('/index', (req, res) => {
  if (!req.session.usuario) {
    return res.redirect('/login.html');  // Redirigir a login si no hay sesión
  }

  // Pasamos el nombre del usuario logueado al renderizar la página principal
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Página Principal</title>
    </head>
    <body>
      <div class="sidebar">
        <p>Bienvenido, ${req.session.usuario.nombre}!</p>
      </div>
      <!-- Aquí puedes agregar el contenido de la página principal -->
      <p>Contenido de la página principal.</p>
      <a href="/cerrar_sesion">Cerrar sesión</a>
    </body>
    </html>
  `);
});

// Ruta para cerrar sesión
app.get('/cerrar_sesion', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }

    // Redirigir a la página de inicio de sesión
    res.redirect('/login.html');
  });
});

// Ruta para el registro de usuarios
app.post('/registrar', (req, res) => {
  const { nombre, email, contraseña, rango } = req.body;

  // Verificar si el email ya está registrado
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).send('Error en la base de datos');
    }

    if (results.length > 0) {
      return res.status(400).send('El correo electrónico ya está registrado');
    }

    // Cifrar la contraseña con bcrypt
    bcrypt.hash(contraseña, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).send('Error al cifrar la contraseña');
      }

      // Insertar el usuario en la base de datos con la contraseña cifrada
      db.query('INSERT INTO usuarios (nombre, email, contraseña, rango) VALUES (?, ?, ?, ?)', 
        [nombre, email, hashedPassword, rango], (err, results) => {
          if (err) {
            return res.status(500).send('Error al insertar usuario');
          }

          // Enviar respuesta de éxito
          res.status(200).send('Usuario registrado correctamente');
        });
    });
  });
});

// Servir las páginas estáticas (como HTML, CSS, JS)
app.use(express.static('public'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
