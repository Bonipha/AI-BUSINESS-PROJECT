import { ObjectId } from 'mongodb';
import { connectDatabase } from '../database.js';

async function listOwners() {
  const database = await connectDatabase();
  return database.collection('users').find(
    { role: 'owner' },
    { projection: { passwordHash: 0, passwordSalt: 0 } },
  ).toArray();
}

async function getOwnerById(id) {
  const database = await connectDatabase();
  return database.collection('users').findOne(
    { _id: new ObjectId(id), role: 'owner' },
    { projection: { passwordHash: 0, passwordSalt: 0 } },
  );
}

async function updateOwner(id, updates) {
  const changes = {};
  if (updates.name !== undefined) changes.name = updates.name;
  if (updates.email !== undefined) changes.email = updates.email.trim().toLowerCase();
  changes.updatedAt = new Date();

  const database = await connectDatabase();
  await database.collection('users').updateOne(
    { _id: new ObjectId(id), role: 'owner' },
    { $set: changes },
  );
  return getOwnerById(id);
}

export { getOwnerById, listOwners, updateOwner };
