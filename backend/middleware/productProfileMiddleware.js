function validateProductProfile(request, response, next) {
  const profile = request.body || {};
  if (profile.tags !== undefined && (!Array.isArray(profile.tags) || profile.tags.some(tag => typeof tag !== 'string'))) {
    return response.status(400).json({ error: 'tags must be an array of strings' });
  }
  if (profile.gallery !== undefined && (!Array.isArray(profile.gallery) || profile.gallery.some(url => typeof url !== 'string'))) {
    return response.status(400).json({ error: 'gallery must be an array of strings' });
  }
  if (profile.featured !== undefined && typeof profile.featured !== 'boolean') {
    return response.status(400).json({ error: 'featured must be a boolean' });
  }
  return next();
}

module.exports = { validateProductProfile };
