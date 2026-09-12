import './env.js';
import http from 'node:http';
import { closeDatabase, connectDatabase } from './database.js';
import { login, logout } from './controllers/authentication.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import { handleRoutes } from './routes/index.js';
import { initSocket } from './socket.js';

const port = Number(process.env.PORT) || 3000;

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

const server = http.createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.url.startsWith('/api/auth')) {
    return toNodeHandler(auth)(request, response);
  }

  if (await handleRoutes(request, response)) return;

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

  if (request.method === 'POST' && request.url === '/auth/login') {
    try {
      const { email, password } = JSON.parse(await readRequestBody(request));
      const result = await login(email, password);
      response.writeHead(200);
      response.end(JSON.stringify(result));
    } catch (error) {
      response.writeHead(401);
      response.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (request.method === 'POST' && request.url === '/auth/logout') {
    const header = request.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const loggedOut = logout(token);
    response.writeHead(loggedOut ? 200 : 401);
    response.end(JSON.stringify(loggedOut ? { success: true } : { error: 'Authentication required' }));
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ error: 'Route not found' }));
});

initSocket(server);

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
