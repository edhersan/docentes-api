const { route } = require('../src/router/router');
const { handleError } = require('../src/controllers/profesor.controller');

// Vercel invoca esta función con la misma interfaz req/res de Node.js.
module.exports = async function handler(req, res) {
  try {
    await route(req, res);
  } catch (error) {
    handleError(res, error);
  }
};
