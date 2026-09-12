import { getUserProfile, updateUserProfilePicture, upsertUserProfile } from '../controllers/userProfileController.js';
import { authenticateUser } from '../middleware/userMiddleware.js';
import { requireSelfOrAdmin } from '../middleware/managementMiddleware.js';
import { validateUserProfile } from '../middleware/userProfileMiddleware.js';
import { controllerRoute } from './router.js';

const withAuth = [authenticateUser, requireSelfOrAdmin];
export default [
  controllerRoute('GET', '/api/users/:userId/profile', async (request, response) => response.json(await getUserProfile(request.params.userId)), withAuth),
  controllerRoute('PUT', '/api/users/:userId/profile', async (request, response) => response.json(await upsertUserProfile(request.params.userId, request.body)), [authenticateUser, requireSelfOrAdmin, validateUserProfile]),
  controllerRoute('POST', '/api/users/:userId/profile/avatar', async (request, response) => response.json(await updateUserProfilePicture(request.params.userId, request.body.image)), [authenticateUser, requireSelfOrAdmin]),
];