const { getPool } = require('../config/db');

const COLUMNS = [
  'nombre',
  'apellido',
  'resumen',
  'titulos',
  'experiencia_laboral',
  'url_imagen'
];

async function findAll() {
  const [rows] = await getPool().execute(
    `SELECT id, nombre, apellido, resumen, titulos,
            experiencia_laboral, url_imagen
       FROM profesor
      ORDER BY id`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await getPool().execute(
    `SELECT id, nombre, apellido, resumen, titulos,
            experiencia_laboral, url_imagen
       FROM profesor
      WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create(profesor) {
  const columns = COLUMNS.filter((column) => profesor[column] !== undefined);
  const values = columns.map((column) => profesor[column]);
  const placeholders = columns.map(() => '?').join(', ');

  const [result] = await getPool().execute(
    `INSERT INTO profesor (${columns.join(', ')})
     VALUES (${placeholders})`,
    values
  );

  return findById(result.insertId);
}

async function updateById(id, changes) {
  const columns = COLUMNS.filter((column) => changes[column] !== undefined);
  const values = columns.map((column) => changes[column]);

  if (columns.length === 0) {
    return findById(id);
  }

  const assignments = columns.map((column) => `${column} = ?`).join(', ');
  await getPool().execute(
    `UPDATE profesor SET ${assignments} WHERE id = ?`,
    [...values, id]
  );
  return findById(id);
}

async function deleteById(id) {
  const [result] = await getPool().execute(
    'DELETE FROM profesor WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, updateById, deleteById };
