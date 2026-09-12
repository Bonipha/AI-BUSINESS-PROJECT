import jwt from 'jsonwebtoken';

const issuer = 'ai-project';

function getSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured on the server');
  }

  return process.env.JWT_SECRET;
}

function createToken({ id, role, type }) {
  return jwt.sign(
    { sub: String(id), role, type },
    getSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d', issuer },
  );
}

function verifyToken(token) {
  return jwt.verify(token, getSecret(), { issuer });
}

export { createToken, verifyToken };