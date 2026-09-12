function requireOwner(request, response, next) {
  if (!request.user) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  if (request.user.role !== 'owner') {
    return response.status(403).json({ error: 'Owner access required' });
  }

  return next();
}

export { requireOwner };
