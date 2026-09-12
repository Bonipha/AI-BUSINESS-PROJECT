import { getShopMarketing, listCustomers, upsertShopMarketing } from '../controllers/ownerDashboardController.js';
import { authenticateUser } from '../middleware/userMiddleware.js';
import { requireOwner } from '../middleware/ownerMiddleware.js';
import { controllerRoute } from './router.js';

const withOwner = [authenticateUser, requireOwner];

export default [
  controllerRoute('GET', '/api/owner/customers', async (_, response) => {
    return response.json(await listCustomers());
  }, withOwner),

  controllerRoute('GET', '/api/owner/shops/:shopId/marketing', async (request, response) => {
    return response.json(await getShopMarketing(request.params.shopId));
  }, withOwner),

  controllerRoute('PUT', '/api/owner/shops/:shopId/marketing', async (request, response) => {
    return response.json(await upsertShopMarketing(request.params.shopId, request.body));
  }, withOwner),
];
