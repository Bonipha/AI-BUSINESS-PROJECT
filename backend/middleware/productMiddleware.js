function validateProduct(request, response, next) {
  const { name, price, stock } = request.body || {};

  if (!name || price === undefined) {
    return response.status(400).json({ error: 'Product name and price are required' });
  }

  if (!Number.isFinite(Number(price)) || Number(price) < 0) {
    return response.status(400).json({ error: 'Price must be a non-negative number' });
  }

  if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
    return response.status(400).json({ error: 'Stock must be a non-negative integer' });
  }

  return next();
}

module.exports = { validateProduct };
