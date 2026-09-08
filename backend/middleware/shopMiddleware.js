function validateShop(request, response, next) {
  const { name, ownerId } = request.body || {};

  if (!name || !ownerId) {
    return response.status(400).json({ error: 'Shop name and ownerId are required' });
  }

  if (!/^[a-fA-F0-9]{24}$/.test(ownerId)) {
    return response.status(400).json({ error: 'ownerId must be a valid MongoDB ObjectId' });
  }

  return next();
}

module.exports = { validateShop };
