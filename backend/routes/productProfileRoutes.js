import { getProductProfile, upsertProductProfile } from '../controllers/productProfileController.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { validateProductProfile } from '../middleware/productProfileMiddleware.js';
import { controllerRoute, readJsonBody } from './router.js';

export default [
  controllerRoute('GET', '/api/products/:productId/profile', async (request, response) => response.json(await getProductProfile(request.params.productId))),
  controllerRoute('PUT', '/api/products/:productId/profile', async (request, response) => response.json(await upsertProductProfile(request.params.productId, await readJsonBody(request))), [requireAdmin, validateProductProfile]),
];