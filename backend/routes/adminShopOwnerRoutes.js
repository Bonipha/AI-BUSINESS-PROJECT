import { deleteShopOwner, getShopOwnerById, listAllShopsAdmin, listShopOwners } from '../controllers/adminShopOwnerController.js';
import { authenticateUser } from '../middleware/userMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { controllerRoute } from './router.js';

const withAdmin = [authenticateUser, requireAdmin];

export default [
  controllerRoute('GET', '/api/admin/shop-owners', async (_, response) => {
    return response.json(await listShopOwners());
  }, withAdmin),

  controllerRoute('GET', '/api/admin/shop-owners/:id', async (request, response) => {
    return response.json(await getShopOwnerById(request.params.id));
  }, withAdmin),

  controllerRoute('DELETE', '/api/admin/shop-owners/:id', async (request, response) => {
    return response.json({ deleted: await deleteShopOwner(request.params.id) });
  }, withAdmin),

  controllerRoute('GET', '/api/admin/shops', async (_, response) => {
    return response.json(await listAllShopsAdmin());
  }, withAdmin),
];
