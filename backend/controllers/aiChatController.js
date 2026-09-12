import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function aiChat({ messages = [], system = '' }) {
  if (!process.env.OPENAI_API_KEY) throw new Error('AI chat is not configured');
  if (!messages.length) throw new Error('messages are required');

  const openaiMessages = [
    ...(system ? [{ role: 'system', content: system }] : []),
    ...messages.map(({ role, content }) => ({ role, content })),
  ];

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: openaiMessages,
    max_tokens: 400,
  });

  return { reply: completion.choices[0].message.content };
}

export { aiChat };
