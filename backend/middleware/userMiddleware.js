import { ObjectId } from 'mongodb';
import { connectDatabase } from '../database.js';
import { verifyToken } from '../jwt.js';
import { auth } from '../auth.js';

function isConfiguredOwner(email) {
  const ownerEmails = (process.env.OWNER_EMAILS || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
  return ownerEmails.includes(email?.toLowerCase());
}

async function authenticateUser(request, response, next) {
  try {
    const header = request.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (token) {
      const claims = verifyToken(token);
      if (!claims.sub || !['admin', 'user'].includes(claims.type)) {
        return response.status(401).json({ error: 'Invalid token' });
      }

      const database = await connectDatabase();
      const collection = claims.type === 'admin' ? 'admins' : 'users';
      const user = await database.collection(collection).findOne(
        { _id: new ObjectId(claims.sub) },
        { projection: { passwordHash: 0, passwordSalt: 0 } },
      );
      if (!user) return response.status(401).json({ error: 'User not found' });

      request.user = user;
      request.token = token;
      request.auth = claims;
      return next();
    }

    const session = await auth.api.getSession({ headers: new Headers(request.headers) });
    if (!session?.user) return response.status(401).json({ error: 'Authentication required' });

    const role = isConfiguredOwner(session.user.email) ? 'owner' : session.user.role;
    request.user = { ...session.user, role };
    request.auth = { sub: session.user.id, role, type: 'user' };
    return next();
  } catch (error) {
    return response.status(401).json({ error: 'Invalid or expired token' });
  }
}

export { authenticateUser };
