import { ChatOpenAI } from '@langchain/openai';
import { tool } from '@langchain/core/tools';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';
import { connectDatabase } from '../database.js';

// ── Tools ────────────────────────────────────────────────────────────────────

const searchProductsTool = tool(
  async ({ query, category, maxPrice, minPrice, limit = 8 }) => {
    const db = await connectDatabase();
    const filter = {};
    if (query) filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ];
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
    const products = await db.collection('products').find(filter).limit(limit).toArray();
    if (!products.length) return 'No products found matching those criteria.';
    return products.map(p =>
      `• ${p.name} — $${p.price} | Category: ${p.category || 'N/A'} | Stock: ${p.stock} | ${p.description || ''}`
    ).join('\n');
  },
  {
    name: 'search_products',
    description: 'Search for products by name, description, category, or price range. Use this when the user asks about products, items, or what is available.',
    schema: z.object({
      query: z.string().optional().describe('Search term for product name or description'),
      category: z.string().optional().describe('Product category e.g. electronics, apparel, homeware'),
      minPrice: z.number().optional().describe('Minimum price filter'),
      maxPrice: z.number().optional().describe('Maximum price filter'),
      limit: z.number().optional().describe('Max number of results, default 8'),
    }),
  }
);

const searchShopsTool = tool(
  async ({ query, status = 'active', limit = 6 }) => {
    const db = await connectDatabase();
    const filter = { status };
    if (query) filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { address: { $regex: query, $options: 'i' } },
    ];
    const shops = await db.collection('shops').find(filter).limit(limit).toArray();
    if (!shops.length) return 'No shops found matching those criteria.';
    return shops.map(s =>
      `• ${s.name} | ${s.description || ''} | Address: ${s.address || 'N/A'} | Email: ${s.email || 'N/A'}`
    ).join('\n');
  },
  {
    name: 'search_shops',
    description: 'Search for shops/stores on the marketplace. Use this when the user asks about shops, sellers, or stores.',
    schema: z.object({
      query: z.string().optional().describe('Search term for shop name, description, or location'),
      status: z.string().optional().describe('Shop status filter, default is active'),
      limit: z.number().optional().describe('Max number of results, default 6'),
    }),
  }
);

const listCategoriesTools = tool(
  async () => {
    const db = await connectDatabase();
    const categories = await db.collection('products').distinct('category');
    const filtered = categories.filter(Boolean);
    if (!filtered.length) return 'No categories found.';
    return `Available categories: ${filtered.join(', ')}`;
  },
  {
    name: 'list_categories',
    description: 'List all available product categories. Use this when the user asks what categories or types of products are available.',
    schema: z.object({}),
  }
);

const getFeaturedProductsTool = tool(
  async ({ limit = 6 }) => {
    const db = await connectDatabase();
    const products = await db.collection('products')
      .find({ stock: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    if (!products.length) return 'No products available right now.';
    return products.map(p =>
      `• ${p.name} — $${p.price} | Category: ${p.category || 'N/A'} | Stock: ${p.stock}`
    ).join('\n');
  },
  {
    name: 'get_featured_products',
    description: 'Get the latest or featured products. Use this when the user asks what is new, what is available, or wants to browse.',
    schema: z.object({
      limit: z.number().optional().describe('Max number of results, default 6'),
    }),
  }
);

// ── Agent ────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a helpful shopping assistant for Morrow, a curated marketplace selling small-batch goods — apparel, homeware, and accessories.

You have access to real-time tools to search products, shops, and categories from the marketplace database. Always use the tools to give accurate, up-to-date answers.

Guidelines:
- When users ask about products, items, or what's available → use search_products or get_featured_products
- When users ask about shops or sellers → use search_shops
- When users ask about categories or types of products → use list_categories
- Keep replies warm, concise, and helpful
- Format product/shop results clearly with names and prices
- If nothing is found, suggest alternatives or broader searches`;

let agent;
function getAgent() {
  if (!agent) {
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4o-mini',
      temperature: 0.3,
    });
    agent = createReactAgent({
      llm: model,
      tools: [searchProductsTool, searchShopsTool, listCategoriesTools, getFeaturedProductsTool],
      stateModifier: SYSTEM_PROMPT,
    });
  }
  return agent;
}

// ── Controller ───────────────────────────────────────────────────────────────

async function aiChat({ messages = [] }) {
  if (!process.env.OPENAI_API_KEY) throw new Error('AI chat is not configured');
  if (!messages.length) throw new Error('messages are required');

  const langchainMessages = messages.map(({ role, content }) => ({ role, content }));

  const result = await getAgent().invoke({ messages: langchainMessages });

  const last = result.messages.at(-1);
  return { reply: last.content };
}

export { aiChat };
