const { ObjectId } = require('mongodb');
const { connectDatabase } = require('../database');

async function createProduct({ name, description = '', price, stock = 0, category = '', imageUrl = '' }) {
  if (!name || price === undefined) throw new Error('Product name and price are required');
  if (Number(price) < 0 || Number(stock) < 0) throw new Error('Price and stock cannot be negative');

  const product = {
    name,
    description,
    price: Number(price),
    stock: Number(stock),
    category,
    imageUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const database = await connectDatabase();
  const result = await database.collection('products').insertOne(product);
  return { ...product, _id: result.insertedId };
}

async function listProducts(filter = {}) {
  const database = await connectDatabase();
  return database.collection('products').find(filter).sort({ createdAt: -1 }).toArray();
}

async function getProductById(id) {
  const database = await connectDatabase();
  return database.collection('products').findOne({ _id: new ObjectId(id) });
}

async function updateProduct(id, updates) {
  const allowedFields = ['name', 'description', 'price', 'stock', 'category', 'imageUrl'];
  const changes = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedFields.includes(key)));
  if (changes.price !== undefined) changes.price = Number(changes.price);
  if (changes.stock !== undefined) changes.stock = Number(changes.stock);
  changes.updatedAt = new Date();

  const database = await connectDatabase();
  await database.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: changes });
  return getProductById(id);
}

async function deleteProduct(id) {
  const database = await connectDatabase();
  const result = await database.collection('products').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

module.exports = { createProduct, deleteProduct, getProductById, listProducts, updateProduct };
