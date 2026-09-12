function validateShopProfile(request, response, next) {
  const profile = request.body || {};
  if (profile.businessHours !== undefined && typeof profile.businessHours !== 'object') {
    return response.status(400).json({ error: 'businessHours must be an object' });
  }
  if (profile.socialLinks !== undefined && typeof profile.socialLinks !== 'object') {
    return response.status(400).json({ error: 'socialLinks must be an object' });
  }
  return next();
}

export { validateShopProfile };
