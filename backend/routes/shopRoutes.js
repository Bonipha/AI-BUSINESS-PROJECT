import { createShop, deleteShop, getShopById, listShops, updateShop } from '../controllers/shopController.js';
import { requireOwner } from '../middleware/ownerMiddleware.js';
import { validateShop } from '../middleware/shopMiddleware.js';
import { controllerRoute, readJsonBody } from './router.js';

export default [
  controllerRoute('GET', '/api/shops', async (request, response) => response.json(await listShops(request.query))),
  controllerRoute('GET', '/api/shops/:id', async (request, response) => response.json(await getShopById(request.params.id))),
  controllerRoute('POST', '/api/shops', async (request, response) => response.status(201).json(await createShop(await readJsonBody(request))), [requireOwner, validateShop]),
  controllerRoute('PATCH', '/api/shops/:id', async (request, response) => response.json(await updateShop(request.params.id, await readJsonBody(request))), [requireOwner]),
  controllerRoute('DELETE', '/api/shops/:id', async (request, response) => response.json({ deleted: await deleteShop(request.params.id) }), [requireOwner]),
];