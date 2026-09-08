const { ObjectId } = require('mongodb');
const { connectDatabase } = require('../database');

async function getUserProfile(userId) {
  const database = await connectDatabase();
  return database.collection('userProfiles').findOne({ userId: new ObjectId(userId) });
}

async function upsertUserProfile(userId, profile) {
  const database = await connectDatabase();
  const allowedFields = ['displayName', 'avatarUrl', 'phone', 'address', 'bio'];
  const changes = Object.fromEntries(Object.entries(profile).filter(([key]) => allowedFields.includes(key)));
  changes.updatedAt = new Date();

  await database.collection('userProfiles').updateOne(
    { userId: new ObjectId(userId) },
    { $set: changes, $setOnInsert: { userId: new ObjectId(userId), createdAt: new Date() } },
    { upsert: true },
  );
  return getUserProfile(userId);
}

module.exports = { getUserProfile, upsertUserProfile };
