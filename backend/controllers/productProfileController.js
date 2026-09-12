import { ObjectId } from 'mongodb';
import { connectDatabase } from '../database.js';

async function getProductProfile(productId) {
  const database = await connectDatabase();
  return database.collection('productProfiles').findOne({ productId: new ObjectId(productId) });
}

async function upsertProductProfile(productId, profile) {
  const database = await connectDatabase();
  const allowedFields = ['specifications', 'tags', 'gallery', 'featured'];
  const changes = Object.fromEntries(Object.entries(profile).filter(([key]) => allowedFields.includes(key)));
  changes.updatedAt = new Date();

  await database.collection('productProfiles').updateOne(
    { productId: new ObjectId(productId) },
    { $set: changes, $setOnInsert: { productId: new ObjectId(productId), createdAt: new Date() } },
    { upsert: true },
  );
  return getProductProfile(productId);
}

export { getProductProfile, upsertProductProfile };
