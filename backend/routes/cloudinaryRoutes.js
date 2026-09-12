import { uploadImage } from '../controllers/cloudinaryController.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { controllerRoute, readJsonBody } from './router.js';

export default [
  controllerRoute('POST', '/api/uploads/images', async (request, response) => response.status(201).json(await uploadImage(await readJsonBody(request))), [requireAdmin]),
];