const mysql = require('mysql2/promise');

// El pool se crea una sola vez por instancia de la función serverless.
// Las invocaciones posteriores reutilizan las conexiones disponibles.
let pool;

function getPool() {
  if (!pool) {
    const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
    const missing = required.filter((name) => !process.env[name]);

    if (missing.length > 0) {
      throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
    }

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }

  return pool;
}

module.exports = { getPool };
