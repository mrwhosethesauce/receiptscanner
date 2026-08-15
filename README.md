# Receipt Scanner

A MERN-stack expense tracker that uses Google Gemini to read receipt photos and generate personalized financial tips. Deployed as a single Vercel project (Express API as serverless functions + a Vite/React frontend).

## Stack
- **Frontend**: React (Vite) + Tailwind CSS + React Router + Recharts
- **Backend**: Express, running as Vercel serverless functions
- **Database**: MongoDB Atlas (via Mongoose)
- **AI**: Google Gemini (`@google/genai`, `gemini-2.5-flash`, free tier) — vision for receipt extraction, text for financial tips
- **File storage**: Vercel Blob
- **Auth**: JWT (email/password)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:
   - `MONGODB_URI` — a MongoDB Atlas connection string (free M0 cluster works)
   - `JWT_SECRET` — any long random string
   - `GEMINI_API_KEY` — free, from https://aistudio.google.com/apikey
   - `BLOB_READ_WRITE_TOKEN` — from your Vercel project's Storage tab (create a Blob store first)

3. Run locally with the Vercel CLI (recommended — matches production routing):
   ```
   npm install -g vercel
   vercel link
   vercel env pull .env
   vercel dev
   ```
   This serves the API and the client together, matching `vercel.json`'s routing.

   Alternatively, for plain frontend-only iteration, run `npm run dev --workspace api` (Express on :4000) and `npm run dev --workspace client` (Vite on :5173, proxying `/api` to :4000) in separate terminals.

4. Open the app, sign up, and try scanning a receipt photo.

## Deploying to Vercel

1. `vercel` (or connect the repo in the Vercel dashboard once you're ready to push to a Git provider).
2. Set the same environment variables from `.env` in the Vercel project settings.
3. Create a Blob store under the project's Storage tab if you haven't already, and link it (this provides `BLOB_READ_WRITE_TOKEN` automatically).
4. Deploy.

## Notes
- This repo is git-initialized locally but intentionally has no remote configured — nothing is pushed to GitHub yet.
