import { ObjectId } from 'mongodb';
import { connectDatabase } from '../database.js';

async function listCustomers() {
  const database = await connectDatabase();
  return database.collection('users').find(
    { role: 'customer' },
    { projection: { passwordHash: 0, passwordSalt: 0 } },
  ).sort({ createdAt: -1 }).toArray();
}

async function getShopMarketing(shopId) {
  const database = await connectDatabase();
  return database.collection('shopMarketing').findOne({ shopId: new ObjectId(shopId) });
}

async function upsertShopMarketing(shopId, data) {
  const database = await connectDatabase();
  const allowedFields = ['headline', 'promoText', 'discountPercent', 'featuredProductIds', 'campaignBannerUrl', 'campaignEndsAt'];
  const changes = Object.fromEntries(Object.entries(data).filter(([key]) => allowedFields.includes(key)));
  if (changes.featuredProductIds) {
    changes.featuredProductIds = changes.featuredProductIds.map(id => new ObjectId(id));
  }
  if (changes.campaignEndsAt) changes.campaignEndsAt = new Date(changes.campaignEndsAt);
  if (changes.discountPercent !== undefined) changes.discountPercent = Number(changes.discountPercent);
  changes.updatedAt = new Date();

  await database.collection('shopMarketing').updateOne(
    { shopId: new ObjectId(shopId) },
    { $set: changes, $setOnInsert: { shopId: new ObjectId(shopId), createdAt: new Date() } },
    { upsert: true },
  );
  return getShopMarketing(shopId);
}

export { getShopMarketing, listCustomers, upsertShopMarketing };
