const { ObjectId } = require('mongodb');
const { connectDatabase } = require('../database');

async function authenticateUser(request, response, next) {
  try {
    const header = request.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return response.status(401).json({ error: 'Authentication required' });

    const database = await connectDatabase();
    const session = await database.collection('sessions').findOne({
      token,
      expiresAt: { $gt: new Date() },
    });
    if (!session) return response.status(401).json({ error: 'Invalid or expired session' });

    const user = await database.collection('users').findOne(
      { _id: new ObjectId(session.adminId) },
      { projection: { passwordHash: 0, passwordSalt: 0 } },
    );
    if (!user) return response.status(401).json({ error: 'User not found' });

    request.user = user;
    request.token = token;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { authenticateUser };
