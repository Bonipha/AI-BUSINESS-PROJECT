import bcrypt from 'bcryptjs';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

async function hashPassword(password) {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password is required');
  }

  return bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, passwordHash) {
  if (typeof password !== 'string' || typeof passwordHash !== 'string') {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

export {
  comparePassword,
  hashPassword,
};
