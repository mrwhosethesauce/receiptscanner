const Anthropic = require('@anthropic-ai/sdk');

let client;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

const MODEL = 'claude-sonnet-4-5-20250929';

const RECEIPT_PROMPT = `You are extracting structured data from a photo of a receipt.
Return ONLY a single JSON object (no prose, no markdown fences) with this exact shape:
{
  "merchant": string,
  "date": string (ISO 8601, best guess if unclear),
  "total": number,
  "category": string (one of: Groceries, Dining, Transport, Utilities, Shopping, Health, Entertainment, Travel, Other),
  "items": [ { "name": string, "price": number } ]
}
If a field cannot be determined, use your best reasonable estimate. Never include commentary outside the JSON.`;

async function extractReceipt(base64Image, mediaType) {
  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Image } },
          { type: 'text', text: RECEIPT_PROMPT },
        ],
      },
    ],
  });

  const text = message.content.find((block) => block.type === 'text')?.text ?? '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude did not return parseable JSON');

  return JSON.parse(jsonMatch[0]);
}

async function generateTips(summary) {
  const anthropic = getClient();
  const prompt = `Here is a summary of a user's recent expenses, grouped by category and month:

${JSON.stringify(summary, null, 2)}

Based on this spending pattern, give 3-5 concrete, specific, actionable financial tips to help this person save money or budget better. Reference actual categories/amounts from the data. Return the tips as a JSON array of strings, and nothing else.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content.find((block) => block.type === 'text')?.text ?? '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Claude did not return parseable JSON');

  return JSON.parse(jsonMatch[0]);
}

module.exports = { extractReceipt, generateTips };
