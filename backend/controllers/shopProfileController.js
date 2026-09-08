const { ObjectId } = require('mongodb');
const { connectDatabase } = require('../database');

async function getShopProfile(shopId) {
  const database = await connectDatabase();
  return database.collection('shopProfiles').findOne({ shopId: new ObjectId(shopId) });
}

async function upsertShopProfile(shopId, profile) {
  const database = await connectDatabase();
  const allowedFields = ['tagline', 'bannerUrl', 'businessHours', 'socialLinks', 'policies'];
  const changes = Object.fromEntries(Object.entries(profile).filter(([key]) => allowedFields.includes(key)));
  changes.updatedAt = new Date();

  await database.collection('shopProfiles').updateOne(
    { shopId: new ObjectId(shopId) },
    { $set: changes, $setOnInsert: { shopId: new ObjectId(shopId), createdAt: new Date() } },
    { upsert: true },
  );
  return getShopProfile(shopId);
}

module.exports = { getShopProfile, upsertShopProfile };
