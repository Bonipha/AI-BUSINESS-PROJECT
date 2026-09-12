import { ObjectId } from 'mongodb';
import { connectDatabase } from '../database.js';
import { uploadImage } from './cloudinaryController.js';
import { getIO } from '../socket.js';

async function updateOwnProduct(ownerId, productId, updates) {
  const database = await connectDatabase();

  const product = await database.collection('products').findOne({ _id: new ObjectId(productId) });
  if (!product) throw new Error('Product not found');
  if (String(product.ownerId) !== String(ownerId)) throw new Error('You can only edit your own products');

  const allowedFields = ['name', 'description', 'price', 'stock', 'category', 'imageUrl', 'lowStockThreshold'];
  if (updates.image) updates.imageUrl = (await uploadImage({ image: updates.image, folder: 'ai-project/products' })).url;
  const changes = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedFields.includes(key)));
  if (changes.price !== undefined) changes.price = Number(changes.price);
  if (changes.stock !== undefined) changes.stock = Number(changes.stock);
  if (changes.lowStockThreshold !== undefined) changes.lowStockThreshold = Number(changes.lowStockThreshold);
  changes.updatedAt = new Date();

  await database.collection('products').updateOne({ _id: new ObjectId(productId) }, { $set: changes });

  const updated = await database.collection('products').findOne({ _id: new ObjectId(productId) });
  const threshold = updated.lowStockThreshold ?? 10;
  if (updated.stock <= threshold) {
    try {
      getIO().emit('low_stock', {
        productId: updated._id,
        name: updated.name,
        stock: updated.stock,
        threshold,
      });
    } catch {}
  }

  return updated;
}

async function setLowStockThreshold(ownerId, productId, threshold) {
  return updateOwnProduct(ownerId, productId, { lowStockThreshold: threshold });
}

async function getProductStock(productId) {
  const database = await connectDatabase();
  const product = await database.collection('products').findOne(
    { _id: new ObjectId(productId) },
    { projection: { name: 1, stock: 1, lowStockThreshold: 1 } },
  );
  if (!product) throw new Error('Product not found');
  return {
    productId: product._id,
    name: product.name,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold ?? 10,
    isLow: product.stock <= (product.lowStockThreshold ?? 10),
  };
}

export { getProductStock, setLowStockThreshold, updateOwnProduct };
