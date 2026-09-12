import adminRoutes from './adminRoutes.js';
import cloudinaryRoutes from './cloudinaryRoutes.js';
import ownerRoutes from './ownerRoutes.js';
import productRoutes from './productRoutes.js';
import productProfileRoutes from './productProfileRoutes.js';
import shopRoutes from './shopRoutes.js';
import shopProfileRoutes from './shopProfileRoutes.js';
import userRoutes from './userRoutes.js';
import userProfileRoutes from './userProfileRoutes.js';
import { createRouter } from './router.js';

export const handleRoutes = createRouter([
  ...adminRoutes,
  ...cloudinaryRoutes,
  ...ownerRoutes,
  ...productRoutes,
  ...productProfileRoutes,
  ...shopRoutes,
  ...shopProfileRoutes,
  ...userRoutes,
  ...userProfileRoutes,
]);