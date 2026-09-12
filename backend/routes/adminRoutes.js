import { getAdminById, listAdmins, updateAdmin } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { controllerRoute, readJsonBody } from './router.js';

const withAdmin = [requireAdmin];
export default [
  controllerRoute('GET', '/api/admins', async (_, response) => response.json(await listAdmins()), withAdmin),
  controllerRoute('GET', '/api/admins/:id', async (request, response) => response.json(await getAdminById(request.params.id)), withAdmin),
  controllerRoute('PATCH', '/api/admins/:id', async (request, response) => response.json(await updateAdmin(request.params.id, await readJsonBody(request))), withAdmin),
];