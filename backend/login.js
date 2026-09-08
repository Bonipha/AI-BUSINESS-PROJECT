const crypto = require('crypto');
const { connectDatabase } = require('./database');
const { findAdminByEmail } = require('./shopAdmin');

function verifyPassword(password, passwordHash, passwordSalt) {
  const candidateHash = crypto.scryptSync(password, passwordSalt, 64).toString('hex');
  return crypto.timingSafeEqual(
    Buffer.from(candidateHash, 'hex'),
    Buffer.from(passwordHash, 'hex'),
  );
}

async function login(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const admin = await findAdminByEmail(email);
  if (!admin || !verifyPassword(password, admin.passwordHash, admin.passwordSalt)) {
    throw new Error('Invalid email or password');
  }

  const database = await connectDatabase();
  const token = crypto.randomBytes(32).toString('hex');
  await database.collection('sessions').insertOne({
    token,
    adminId: admin._id,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  return {
    token,
    admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
  };
}

module.exports = { login, verifyPassword };
