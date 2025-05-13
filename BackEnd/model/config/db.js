const mysql = require('mysql2');

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',  // Dirección del servidor
  user: 'root', // Usuario de MySQL
  password: '', // Contraseña de MySQL
});

// Verifica si la conexión es exitosa
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Exportar la conexión para usarla en otras partes del proyecto
module.exports = connection;
