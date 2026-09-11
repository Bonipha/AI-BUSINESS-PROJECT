const http = require('http');
const https = require('https');
const crypto = require('crypto');
const { closeDatabase, connectDatabase } = require('./database');

const port = Number(process.env.PORT) || 3000;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
let googleCertificates;

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function fetchGoogleCertificates() {
  return new Promise((resolve, reject) => {
    https.get('https://www.googleapis.com/oauth2/v3/certs', (response) => {
      let body = '';
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        if (response.statusCode !== 200) {
          reject(new Error('Unable to load Google certificates'));
          return;
        }
        resolve(JSON.parse(body));
      });
    }).on('error', reject);
  });
}

async function verifyGoogleCredential(credential) {
  if (!googleClientId) throw new Error('Google sign-in is not configured on the server');
  const [encodedHeader, encodedPayload, encodedSignature] = credential.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) throw new Error('Invalid Google credential');
  const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString());
  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
  if (payload.iss !== 'https://accounts.google.com' && payload.iss !== 'accounts.google.com') throw new Error('Invalid Google issuer');
  if (payload.aud !== googleClientId || payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Invalid Google credential');
  googleCertificates = googleCertificates || await fetchGoogleCertificates();
  if (!googleCertificates[header.kid]) googleCertificates = await fetchGoogleCertificates();
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  if (!verifier.verify(googleCertificates[header.kid], Buffer.from(encodedSignature, 'base64url'))) throw new Error('Invalid Google signature');
  return payload;
}

const server = http.createServer(async (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

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

  if (request.method === 'POST' && request.url === '/auth/google') {
    try {
      const { credential } = JSON.parse(await readRequestBody(request));
      const googleUser = await verifyGoogleCredential(credential);
      const database = await connectDatabase();
      const user = { googleId: googleUser.sub, email: googleUser.email, name: googleUser.name, picture: googleUser.picture, updatedAt: new Date() };
      const result = await database.collection('users').findOneAndUpdate(
        { googleId: googleUser.sub },
        { $set: user, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, returnDocument: 'after' },
      );
      const token = crypto.randomBytes(32).toString('hex');
      await database.collection('sessions').insertOne({ token, userId: result._id, createdAt: new Date(), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) });
      response.writeHead(200);
      response.end(JSON.stringify({ token, user: { id: result._id, email: user.email, name: user.name, picture: user.picture } }));
    } catch (error) {
      response.writeHead(401);
      response.end(JSON.stringify({ error: error.message }));
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
