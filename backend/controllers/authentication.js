import crypto from 'node:crypto';
import { connectDatabase } from '../database.js';
import { comparePassword } from '../bcrypt.js';
import { findAdminByEmail } from './shopAdminController.js';
import { createToken } from '../jwt.js';

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
  if (admin && verifyPassword(password, admin.passwordHash, admin.passwordSalt)) {
    const token = createToken({ id: admin._id, role: admin.role, type: 'admin' });
    return {
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
    };
  }

  const database = await connectDatabase();
  const user = await database.collection('users').findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await comparePassword(password, user.passwordHash)) || !['owner', 'customer'].includes(user.role)) {
    throw new Error('Invalid email or password');
  }

  const token = createToken({ id: user._id, role: user.role, type: 'user' });

  return {
    token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
  };
}

function logout(token) {
  return Boolean(token);
}

export { login, logout, verifyPassword };