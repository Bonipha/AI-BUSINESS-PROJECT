function validateUserProfile(request, response, next) {
  const profile = request.body || {};
  if (profile.displayName !== undefined && typeof profile.displayName !== 'string') {
    return response.status(400).json({ error: 'displayName must be a string' });
  }
  if (profile.bio !== undefined && typeof profile.bio !== 'string') {
    return response.status(400).json({ error: 'bio must be a string' });
  }
  return next();
}

export { validateUserProfile };
