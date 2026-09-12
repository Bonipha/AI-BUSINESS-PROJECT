import { aiChat } from '../controllers/aiChatController.js';
import { controllerRoute } from './router.js';

export default [
  controllerRoute('POST', '/api/ai/chat', async (request, response) => {
    return response.status(200).json(await aiChat(request.body));
  }),
];
