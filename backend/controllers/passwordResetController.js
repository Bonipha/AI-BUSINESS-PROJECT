import crypto from 'node:crypto';
import { connectDatabase } from '../database.js';
import { hashPassword } from './shopAdminController.js';

async function createPasswordResetToken(email) {
  const database = await connectDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const admin = await database.collection('admins').findOne({ email: normalizedEmail });
  if (!admin) {
    return null;
  }

  const token = crypto.randomBytes(32).toString('hex');
  await database.collection('passwordResets').insertOne({
    token,
    adminId: admin._id,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 15),
  });

  return token;
}

async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('Reset token and new password are required');
  }

  const database = await connectDatabase();
  const reset = await database.collection('passwordResets').findOne({
    token,
    expiresAt: { $gt: new Date() },
  });

  if (!reset) {
    throw new Error('Invalid or expired reset token');
  }

  const passwordData = hashPassword(newPassword);
  await database.collection('admins').updateOne(
    { _id: reset.adminId },
    { $set: { passwordHash: passwordData.hash, passwordSalt: passwordData.salt } },
  );
  await database.collection('passwordResets').deleteOne({ _id: reset._id });
  await database.collection('sessions').deleteMany({ adminId: reset.adminId });
}

export { createPasswordResetToken, resetPassword };