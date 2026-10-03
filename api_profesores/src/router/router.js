const fs = require('fs');
const path = require('path');
const controller = require('../controllers/profesor.controller');

const OPENAPI_PATH = path.join(__dirname, '..', 'docs', 'openapi.json');

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function sendDocs(res) {
  const openapiUrl = '/openapi.json';
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>API Profesores</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"></head>
<body><div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script>window.ui = SwaggerUIBundle({ url: '${openapiUrl}', dom_id: '#swagger-ui' });</script>
</body></html>`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function sendHome(res) {
  sendJson(res, 200, {
    name: 'API de Profesores',
    docs: '/docs',
    openapi: '/openapi.json',
    endpoints: {
      profesores: '/api/profesores'
    }
  });
}

function sendOpenApi(res) {
  const specification = fs.readFileSync(OPENAPI_PATH, 'utf8');
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(specification);
}

async function route(req, res) {
  const url = new URL(req.url || '/', 'http://localhost');
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'GET' && pathname === '/') return sendHome(res);
  if (req.method === 'GET' && pathname === '/docs') return sendDocs(res);
  if (req.method === 'GET' && pathname === '/openapi.json') return sendOpenApi(res);

  const collection = /^\/api\/profesores$/;
  const item = /^\/api\/profesores\/([^/]+)$/;

  if (req.method === 'GET' && collection.test(pathname)) return controller.list(req, res);
  if (req.method === 'POST' && collection.test(pathname)) return controller.create(req, res);

  const match = pathname.match(item);
  if (match && req.method === 'GET') return controller.getById(req, res, match[1]);
  if (match && req.method === 'PUT') return controller.update(req, res, match[1]);
  if (match && req.method === 'DELETE') return controller.remove(req, res, match[1]);

  sendJson(res, 404, { error: 'Ruta no encontrada' });
}

module.exports = { route };
