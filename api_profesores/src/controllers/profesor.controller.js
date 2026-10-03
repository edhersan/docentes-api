const repository = require('../repositories/profesor.repository');
const { parseJsonBody } = require('../utils/bodyParser');

const FIELDS = [
  'nombre',
  'apellido',
  'resumen',
  'titulos',
  'experiencia_laboral',
  'url_imagen'
];

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(JSON.stringify(payload));
}

function validatePayload(payload, { partial = false } = {}) {
  const unknown = Object.keys(payload).filter((key) => !FIELDS.includes(key));
  if (unknown.length > 0) {
    const error = new Error(`Campos no permitidos: ${unknown.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (!partial) {
    const missing = FIELDS.filter((field) => payload[field] === undefined);
    if (missing.length > 0) {
      const error = new Error(`Faltan campos obligatorios: ${missing.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
  }

  for (const field of FIELDS) {
    if (payload[field] !== undefined && typeof payload[field] !== 'string') {
      const error = new Error(`El campo ${field} debe ser texto`);
      error.statusCode = 400;
      throw error;
    }
  }
}

function parseId(rawId) {
  if (!/^[1-9]\d*$/.test(rawId)) {
    const error = new Error('El id debe ser un entero positivo');
    error.statusCode = 400;
    throw error;
  }
  return Number(rawId);
}

async function list(_req, res) {
  sendJson(res, 200, await repository.findAll());
}

async function getById(_req, res, rawId) {
  const profesor = await repository.findById(parseId(rawId));
  if (!profesor) return sendJson(res, 404, { error: 'Profesor no encontrado' });
  sendJson(res, 200, profesor);
}

async function create(req, res) {
  const payload = await parseJsonBody(req);
  validatePayload(payload);
  sendJson(res, 201, await repository.create(payload));
}

async function update(req, res, rawId) {
  const payload = await parseJsonBody(req);
  validatePayload(payload, { partial: true });
  const profesor = await repository.updateById(parseId(rawId), payload);
  if (!profesor) return sendJson(res, 404, { error: 'Profesor no encontrado' });
  sendJson(res, 200, profesor);
}

async function remove(_req, res, rawId) {
  const deleted = await repository.deleteById(parseId(rawId));
  if (!deleted) return sendJson(res, 404, { error: 'Profesor no encontrado' });
  res.writeHead(204);
  res.end();
}

function handleError(res, error) {
  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  if (statusCode >= 500) console.error(error);
  sendJson(res, statusCode, {
    error: statusCode === 500 ? 'Error interno del servidor' : error.message
  });
}

module.exports = { list, getById, create, update, remove, handleError };
