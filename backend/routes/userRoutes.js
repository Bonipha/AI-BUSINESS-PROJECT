import { createUser, deleteUser, getUserById, updateUser } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/userMiddleware.js';
import { controllerRoute, readJsonBody } from './router.js';

export default [
  controllerRoute('POST', '/api/users', async (request, response) => response.status(201).json(await createUser(await readJsonBody(request)))),
  controllerRoute('GET', '/api/users/:id', async (request, response) => response.json(await getUserById(request.params.id)), [authenticateUser]),
  controllerRoute('PATCH', '/api/users/:id', async (request, response) => response.json(await updateUser(request.params.id, await readJsonBody(request))), [authenticateUser]),
  controllerRoute('DELETE', '/api/users/:id', async (request, response) => response.json({ deleted: await deleteUser(request.params.id) }), [authenticateUser]),
];