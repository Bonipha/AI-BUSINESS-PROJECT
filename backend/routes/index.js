import adminRoutes from './adminRoutes.js';
import adminShopOwnerRoutes from './adminShopOwnerRoutes.js';
import aiChatRoutes from './aiChatRoutes.js';
import cloudinaryRoutes from './cloudinaryRoutes.js';
import ownerRoutes from './ownerRoutes.js';
import ownerProductRoutes from './ownerProductRoutes.js';
import ownerDashboardRoutes from './ownerDashboardRoutes.js';
import productRoutes from './productRoutes.js';
import productProfileRoutes from './productProfileRoutes.js';
import shopRoutes from './shopRoutes.js';
import shopProfileRoutes from './shopProfileRoutes.js';
import userRoutes from './userRoutes.js';
import userProfileRoutes from './userProfileRoutes.js';
import { createRouter } from './router.js';

export const handleRoutes = createRouter([
  ...adminRoutes,
  ...adminShopOwnerRoutes,
  ...aiChatRoutes,
  ...cloudinaryRoutes,
  ...ownerRoutes,
  ...ownerProductRoutes,
  ...ownerDashboardRoutes,
  ...productRoutes,
  ...productProfileRoutes,
  ...shopRoutes,
  ...shopProfileRoutes,
  ...userRoutes,
  ...userProfileRoutes,
]);