const { ObjectId } = require('mongodb');
const { connectDatabase } = require('../database');

async function createShop({ name, ownerId, description = '', email = '', phone = '', address = '', logoUrl = '' }) {
  if (!name || !ownerId) throw new Error('Shop name and ownerId are required');

  const database = await connectDatabase();
  const owner = await database.collection('users').findOne({ _id: new ObjectId(ownerId), role: 'owner' });
  if (!owner) throw new Error('A valid owner is required');

  const shop = {
    name,
    ownerId: new ObjectId(ownerId),
    description,
    email,
    phone,
    address,
    logoUrl,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await database.collection('shops').insertOne(shop);
  return { ...shop, _id: result.insertedId };
}

async function listShops(filter = {}) {
  const database = await connectDatabase();
  return database.collection('shops').find(filter).sort({ createdAt: -1 }).toArray();
}

async function getShopById(id) {
  const database = await connectDatabase();
  return database.collection('shops').findOne({ _id: new ObjectId(id) });
}

async function updateShop(id, updates) {
  const allowedFields = ['name', 'description', 'email', 'phone', 'address', 'logoUrl', 'status'];
  const changes = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedFields.includes(key)));
  changes.updatedAt = new Date();

  const database = await connectDatabase();
  await database.collection('shops').updateOne({ _id: new ObjectId(id) }, { $set: changes });
  return getShopById(id);
}

async function deleteShop(id) {
  const database = await connectDatabase();
  const result = await database.collection('shops').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

module.exports = { createShop, deleteShop, getShopById, listShops, updateShop };
