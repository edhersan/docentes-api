function parseJsonBody(req) {
  const limit = Number(process.env.JSON_BODY_LIMIT || 1048576);

  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    let settled = false;

    const fail = (error) => {
      if (!settled) {
        settled = true;
        reject(error);
      }
    };

    req.on('data', (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > limit) {
        fail(Object.assign(new Error('El cuerpo de la solicitud es demasiado grande'), {
          statusCode: 413
        }));
        req.destroy();
        return;
      }
      body += chunk;
    });

    req.on('end', () => {
      if (settled) return;
      if (!body.trim()) {
        settled = true;
        resolve({});
        return;
      }

      try {
        const parsed = JSON.parse(body);
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
          throw new Error('El cuerpo JSON debe ser un objeto');
        }
        settled = true;
        resolve(parsed);
      } catch (error) {
        fail(Object.assign(new Error('El cuerpo debe contener JSON válido'), {
          statusCode: 400,
          cause: error
        }));
      }
    });

    req.on('error', (error) => fail(error));
  });
}

module.exports = { parseJsonBody };
