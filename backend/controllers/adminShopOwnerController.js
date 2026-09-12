import { ObjectId } from 'mongodb';
import { connectDatabase } from '../database.js';

async function listShopOwners() {
  const database = await connectDatabase();
  return database.collection('users').find(
    { role: 'owner' },
    { projection: { passwordHash: 0, passwordSalt: 0 } },
  ).toArray();
}

async function getShopOwnerById(id) {
  const database = await connectDatabase();
  return database.collection('users').findOne(
    { _id: new ObjectId(id), role: 'owner' },
    { projection: { passwordHash: 0, passwordSalt: 0 } },
  );
}

async function deleteShopOwner(id) {
  const database = await connectDatabase();
  const result = await database.collection('users').deleteOne({ _id: new ObjectId(id), role: 'owner' });
  if (result.deletedCount === 0) throw new Error('Owner not found');
  return true;
}

async function listAllShopsAdmin() {
  const database = await connectDatabase();
  const shops = await database.collection('shops').find({}).sort({ createdAt: -1 }).toArray();
  const ownerIds = [...new Set(shops.map(s => String(s.ownerId)))];
  const owners = await database.collection('users').find(
    { _id: { $in: ownerIds.map(id => new ObjectId(id)) } },
    { projection: { name: 1, email: 1 } },
  ).toArray();
  const ownerMap = Object.fromEntries(owners.map(o => [String(o._id), o]));
  return shops.map(shop => ({ ...shop, owner: ownerMap[String(shop.ownerId)] || null }));
}

export { deleteShopOwner, getShopOwnerById, listAllShopsAdmin, listShopOwners };
