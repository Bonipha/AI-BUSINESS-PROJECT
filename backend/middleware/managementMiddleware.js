function requireAdminOrOwner(request, response, next) {
  if (!request.user) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  if (!['admin', 'owner'].includes(request.user.role)) {
    return response.status(403).json({ error: 'Admin or owner access required' });
  }

  return next();
}

function requireSelfOrAdmin(request, response, next) {
  if (!request.user) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  const isAdmin = request.user.role === 'admin';
  const isSelf = request.auth?.sub === request.params.userId;
  if (!isAdmin && !isSelf) {
    return response.status(403).json({ error: 'You can only update your own profile' });
  }

  return next();
}

export { requireAdminOrOwner, requireSelfOrAdmin };