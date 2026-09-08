const { ObjectId } = require('mongodb');
const { connectDatabase } = require('../database');
const { hashPassword } = require('../bcrypt');

async function createUser({ email, password, name = '', role = 'customer' }) {
  if (!email || !password) throw new Error('Email and password are required');
  if (!['customer', 'admin', 'owner'].includes(role)) throw new Error('Invalid user role');

  const database = await connectDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await database.collection('users').findOne({ email: normalizedEmail });
  if (existingUser) throw new Error('A user with this email already exists');

  const passwordHash = await hashPassword(password);
  const user = {
    email: normalizedEmail,
    name,
    passwordHash,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await database.collection('users').insertOne(user);
  return { id: result.insertedId, email: user.email, name: user.name, role: user.role };
}

async function getUserById(id) {
  const database = await connectDatabase();
  return database.collection('users').findOne(
    { _id: new ObjectId(id) },
    { projection: { passwordHash: 0, passwordSalt: 0 } },
  );
}

async function updateUser(id, updates) {
  const allowedFields = ['name', 'email'];
  const changes = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedFields.includes(key)));
  if (changes.email) changes.email = changes.email.trim().toLowerCase();
  changes.updatedAt = new Date();

  const database = await connectDatabase();
  await database.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: changes });
  return getUserById(id);
}

async function deleteUser(id) {
  const database = await connectDatabase();
  const result = await database.collection('users').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

module.exports = { createUser, deleteUser, getUserById, updateUser };
