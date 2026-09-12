import { ObjectId } from 'mongodb';
import { connectDatabase } from '../database.js';

async function listAdmins() {
  const database = await connectDatabase();
  return database.collection('users').find(
    { role: 'admin' },
    { projection: { passwordHash: 0, passwordSalt: 0 } },
  ).toArray();
}

async function getAdminById(id) {
  const database = await connectDatabase();
  return database.collection('users').findOne(
    { _id: new ObjectId(id), role: 'admin' },
    { projection: { passwordHash: 0, passwordSalt: 0 } },
  );
}

async function updateAdmin(id, updates) {
  const changes = {};
  if (updates.name !== undefined) changes.name = updates.name;
  if (updates.email !== undefined) changes.email = updates.email.trim().toLowerCase();
  changes.updatedAt = new Date();

  const database = await connectDatabase();
  await database.collection('users').updateOne(
    { _id: new ObjectId(id), role: 'admin' },
    { $set: changes },
  );
  return getAdminById(id);
}

export { getAdminById, listAdmins, updateAdmin };
