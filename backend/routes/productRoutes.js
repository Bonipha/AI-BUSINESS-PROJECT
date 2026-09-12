import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from '../controllers/productController.js';
import { requireAdminOrOwner } from '../middleware/managementMiddleware.js';
import { validateProduct } from '../middleware/productMiddleware.js';
import { authenticateUser } from '../middleware/userMiddleware.js';
import { controllerRoute } from './router.js';

const withManagement = [authenticateUser, requireAdminOrOwner];
export default [
  controllerRoute('GET', '/api/products', async (request, response) => response.json(await listProducts(request.query)), []),
  controllerRoute('GET', '/api/products/:id', async (request, response) => response.json(await getProductById(request.params.id)), []),
  controllerRoute('POST', '/api/products', async (request, response) => response.status(201).json(await createProduct(request.body)), [authenticateUser, requireAdminOrOwner, validateProduct]),
  controllerRoute('PATCH', '/api/products/:id', async (request, response) => response.json(await updateProduct(request.params.id, request.body)), withManagement),
  controllerRoute('DELETE', '/api/products/:id', async (request, response) => response.json({ deleted: await deleteProduct(request.params.id) }), withManagement),
];