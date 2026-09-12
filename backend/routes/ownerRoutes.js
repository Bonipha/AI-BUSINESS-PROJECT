import { getOwnerById, listOwners, updateOwner } from '../controllers/ownerController.js';
import { requireOwner } from '../middleware/ownerMiddleware.js';
import { controllerRoute, readJsonBody } from './router.js';

const withOwner = [requireOwner];
export default [
  controllerRoute('GET', '/api/owners', async (_, response) => response.json(await listOwners()), withOwner),
  controllerRoute('GET', '/api/owners/:id', async (request, response) => response.json(await getOwnerById(request.params.id)), withOwner),
  controllerRoute('PATCH', '/api/owners/:id', async (request, response) => response.json(await updateOwner(request.params.id, await readJsonBody(request))), withOwner),
];