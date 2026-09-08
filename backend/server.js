const http = require('http');
const { closeDatabase, connectDatabase } = require('./database');

const port = Number(process.env.PORT) || 3000;

const server = http.createServer(async (request, response) => {
  response.setHeader('Content-Type', 'application/json');

  if (request.method === 'GET' && request.url === '/health') {
    response.writeHead(200);
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (request.method === 'GET' && request.url === '/database') {
    try {
      const database = await connectDatabase();
      await database.command({ ping: 1 });
      response.writeHead(200);
      response.end(JSON.stringify({ status: 'connected' }));
    } catch (error) {
      console.error('Database connection failed:', error.message);
      response.writeHead(503);
      response.end(JSON.stringify({ status: 'disconnected' }));
    }
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await closeDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
