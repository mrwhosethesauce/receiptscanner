# Receipt Scanner

A MERN-stack expense tracker that uses AI to read receipt photos and generate personalized financial tips. Deployed as a single Vercel project (Express API as serverless functions + a Vite/React frontend).

**Live**: https://receiptscanner-phi.vercel.app

## Features

- Email/password auth with JWT, plus a full forgot/reset-password flow (emailed reset link, 30-minute single-use token)
- Snap or upload a receipt photo — AI extracts merchant, date, total, category, and line items into an editable form before saving
- Expense list with inline editing (fix any field, including AI misreads, without leaving the page) and delete
- Dashboard with spend-by-category and spend-by-month charts
- Tips page: a static list of general budgeting advice, plus on-demand AI-generated tips personalized to your actual spending history
- All amounts shown in ₹ (INR)

## Stack

- **Frontend**: React (Vite) + Tailwind CSS + React Router + Recharts
- **Backend**: Express, running as Vercel serverless functions
- **Database**: MongoDB Atlas (via Mongoose)
- **AI**: Google Gemini (`@google/genai`, `gemini-3.5-flash`, free tier) — vision for receipt extraction, text for financial tips
- **File storage**: Vercel Blob (receipt images)
- **Email**: Resend (password reset links)
- **Auth**: JWT (email/password), bcrypt password hashing

## Project structure

```
api/            Express app (routes, models, middleware, utils) — deployed as a Vercel serverless function
client/         Vite + React frontend
vercel.json     Routes /api/** to the Express function, everything else to the static client build
```

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
   - `RESEND_API_KEY` — free, from https://resend.com/api-keys (used to send password reset emails)

3. Run locally with the Vercel CLI (recommended — matches production routing):
   ```
   npm install -g vercel
   vercel link
   vercel env pull .env
   vercel dev
   ```
   This serves the API and the client together, matching `vercel.json`'s routing.

   Alternatively, run the API and client separately in two terminals: `npm run start --workspace api` (Express on :4000) and `npm run dev --workspace client` (Vite on :5173, proxying `/api` to :4000).

4. Open the app, sign up, and try scanning a receipt photo.

## Deploying to Vercel

1. `vercel` (or connect the repo in the Vercel dashboard).
2. Set the same environment variables from `.env` in the Vercel project settings (Production, Preview, and Development).
3. Create a Blob store under the project's Storage tab if you haven't already, and link it (this provides `BLOB_READ_WRITE_TOKEN` automatically).
4. Deploy: `vercel deploy --prod`.

## Known limitations

- **Resend sandbox**: until a custom domain is verified in Resend, password reset emails can only be delivered to the email address tied to the Resend account itself — not to arbitrary user emails. Verify a domain in the Resend dashboard to lift this for real multi-user use.
- The bundled client JS is a single ~590KB chunk; not code-split yet.
