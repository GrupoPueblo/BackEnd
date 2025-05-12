const mysql = require('mysql2');
const path = require("path");
const fs = require("fs");
const connection = require('../config/db');  // Importar la conexión desde db.js

const sqlFilePath = path.join(__dirname, "createDatabase.sql");
// Lee el archivo SQL
fs.readFile(sqlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo SQL:', err);
    return;
  }

  // Divide el archivo en varias consultas SQL, separadas por punto y coma
  const queries = data.split(';').map(query => query.trim()).filter(query => query);

  // Ejecuta las consultas una por una
  let queryIndex = 0;

  function executeNextQuery() {
    if (queryIndex < queries.length) {
      const query = queries[queryIndex];

      connection.query(query, (err, results) => {
        if (err) {
          console.error('Error al ejecutar la consulta SQL:', err);
          return;
        } else {
          console.log('Consulta ejecutada correctamente');
          queryIndex++;
          executeNextQuery();  // Ejecuta la siguiente consulta
        }
      });
    } else {
      console.log('Todas las consultas se ejecutaron correctamente');
      connection.end();  // Cierra la conexión después de ejecutar todas las consultas
    }
  }

  // Inicia la ejecución de consultas
  executeNextQuery();
});