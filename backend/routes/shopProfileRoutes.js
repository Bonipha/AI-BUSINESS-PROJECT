import { getShopProfile, upsertShopProfile } from '../controllers/shopProfileController.js';
import { requireOwner } from '../middleware/ownerMiddleware.js';
import { validateShopProfile } from '../middleware/shopProfileMiddleware.js';
import { controllerRoute, readJsonBody } from './router.js';

export default [
  controllerRoute('GET', '/api/shops/:shopId/profile', async (request, response) => response.json(await getShopProfile(request.params.shopId))),
  controllerRoute('PUT', '/api/shops/:shopId/profile', async (request, response) => response.json(await upsertShopProfile(request.params.shopId, await readJsonBody(request))), [requireOwner, validateShopProfile]),
];