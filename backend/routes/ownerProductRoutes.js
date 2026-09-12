import { getProductStock, setLowStockThreshold, updateOwnProduct } from '../controllers/ownerProductController.js';
import { authenticateUser } from '../middleware/userMiddleware.js';
import { requireOwner } from '../middleware/ownerMiddleware.js';
import { controllerRoute } from './router.js';

const withOwner = [authenticateUser, requireOwner];

export default [
  controllerRoute('PATCH', '/api/owner/products/:id', async (request, response) => {
    return response.json(await updateOwnProduct(request.user._id, request.params.id, request.body));
  }, withOwner),

  controllerRoute('GET', '/api/owner/products/:id/stock', async (request, response) => {
    return response.json(await getProductStock(request.params.id));
  }, withOwner),

  controllerRoute('PATCH', '/api/owner/products/:id/stock/threshold', async (request, response) => {
    const { threshold } = request.body;
    if (threshold === undefined) return response.status(400).json({ error: 'threshold is required' });
    return response.json(await setLowStockThreshold(request.user._id, request.params.id, threshold));
  }, withOwner),
];
