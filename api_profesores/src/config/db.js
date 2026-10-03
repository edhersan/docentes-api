const mysql = require('mysql2/promise');
const fs = require('fs');

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

    const ssl = process.env.DB_SSL === 'false'
      ? undefined
      : {
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
          ...(process.env.DB_SSL_CERT && fs.existsSync(process.env.DB_SSL_CERT)
            ? { ca: fs.readFileSync(process.env.DB_SSL_CERT) }
            : {})
        };

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      ssl,
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
