const { GoogleGenAI } = require('@google/genai');

let client;
function getClient() {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

const MODEL = 'gemini-3.5-flash';

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
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      { inlineData: { mimeType: mediaType, data: base64Image } },
      { text: RECEIPT_PROMPT },
    ],
  });

  const text = response.text ?? '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini did not return parseable JSON');

  return JSON.parse(jsonMatch[0]);
}

async function generateTips(summary) {
  const ai = getClient();
  const prompt = `Here is a summary of a user's recent expenses, grouped by category and month:

${JSON.stringify(summary, null, 2)}

Based on this spending pattern, give 3-5 concrete, specific, actionable financial tips to help this person save money or budget better. Reference actual categories/amounts from the data, formatting all money amounts in Indian Rupees using the ₹ symbol (e.g. ₹500), never $. Return the tips as a JSON array of strings, and nothing else.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const text = response.text ?? '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Gemini did not return parseable JSON');

  return JSON.parse(jsonMatch[0]);
}

module.exports = { extractReceipt, generateTips };
