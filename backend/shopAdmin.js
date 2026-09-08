const crypto = require('crypto');
const { connectDatabase } = require('./database');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

async function createAdmin({ email, password, name }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const database = await connectDatabase();
  const admins = database.collection('admins');
  const normalizedEmail = email.trim().toLowerCase();
  const existingAdmin = await admins.findOne({ email: normalizedEmail });

  if (existingAdmin) {
    throw new Error('An admin with this email already exists');
  }

  const passwordData = hashPassword(password);
  const admin = {
    email: normalizedEmail,
    name: name || '',
    passwordHash: passwordData.hash,
    passwordSalt: passwordData.salt,
    role: 'admin',
    createdAt: new Date(),
  };

  const result = await admins.insertOne(admin);
  return { id: result.insertedId, email: admin.email, name: admin.name, role: admin.role };
}

async function findAdminByEmail(email) {
  const database = await connectDatabase();
  return database.collection('admins').findOne({ email: email.trim().toLowerCase() });
}

module.exports = {
  createAdmin,
  findAdminByEmail,
  hashPassword,
};
