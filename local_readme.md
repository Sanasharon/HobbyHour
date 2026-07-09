<<<<<<< HEAD
# HobbyScout

A free, full-stack hobby matchmaker. Describe your budget, free time, and living
situation in a chat interface; get one specific hobby recommendation plus three
beginner-friendly YouTube tutorials to start immediately.

## Stack

- **Next.js 14** (App Router) + **Tailwind CSS**
- **Gemini 2.5 Flash** (`@google/generative-ai`) — structured JSON output for the
  recommendation + a derived YouTube search query
- **YouTube Data API v3** — searches, then fetches `contentDetails` to filter out
  Shorts/very-short clips before returning the top 3 results
- **Vercel** — free hosting, edge runtime on the API route

## Project structure

```
hobbyscout/
├── app/
│   ├── api/chat/route.ts    # POST endpoint: Gemini → YouTube → JSON response
│   ├── layout.tsx           # fonts (Fraunces / Source Serif 4 / IBM Plex Mono)
│   ├── page.tsx             # page shell + header
│   └── globals.css
├── components/
│   ├── ChatWindow.tsx       # conversation state, calls /api/chat
│   ├── ChatInput.tsx        # input bar
│   ├── MessageBubble.tsx    # renders one turn (+ videos if assistant)
│   ├── VideoGrid.tsx        # wraps the 3 result cards
│   └── VideoCard.tsx        # "specimen card" styled video result
├── lib/
│   ├── gemini.ts            # Gemini call with enforced JSON schema
│   ├── youtube.ts           # search + duration filter + formatting
│   └── types.ts             # shared TS types
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Get free API keys**

   - Gemini: https://aistudio.google.com/app/apikey (free tier)
   - YouTube Data API v3: enable it in
     [Google Cloud Console](https://console.cloud.google.com/apis/library/youtube.googleapis.com),
     then create an API key under Credentials. Free tier = 10,000 units/day
     (a search + details lookup here costs ~101 units, so roughly 90–95 full
     matches per day).

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in `GEMINI_API_KEY` and `YOUTUBE_API_KEY`.

4. **Run locally**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`.

5. **Deploy**

   Push to GitHub, import the repo on [Vercel](https://vercel.com), and add the
   same two environment variables in the Vercel project settings. No other
   config needed — the API route already targets the edge runtime.

## How it works

1. User sends a message from `ChatWindow`, which posts the full text history to
   `POST /api/chat`.
2. The route calls `getHobbyMatch()` in `lib/gemini.ts`. Gemini is constrained
   with a `responseSchema` so it always returns `{ reply, hobbyName, searchQuery }`
   as real JSON — no prompt-fragile parsing.
3. If `searchQuery` is non-empty, the route calls `searchBeginnerTutorials()` in
   `lib/youtube.ts`, which searches YouTube, pulls `contentDetails` for the
   candidates in one batched call, filters out anything under 3 minutes (to
   drop Shorts), and returns the top 3.
4. The route returns one JSON payload; the UI renders the text reply and, if
   present, a 3-card "field guide" grid beneath it.

## Notes on the free tiers

- **YouTube quota** is the binding constraint, not Gemini. Each match costs
  1 search call (100 units) + 1 videos.list call (1 unit) = 101 units, against
  a 10,000/day cap. There's a very small in-memory rate limiter in the API
  route (20 requests / 10 minutes per IP) as a first line of defense — swap it
  for Vercel KV or Upstash if you need real cross-instance limits in
  production.
- If the YouTube call fails or quota is exhausted, the route still returns the
  text recommendation with an empty `videos` array rather than failing the
  whole request.

## v2.0 ideas

- Optional accounts (Supabase/Postgres) to save matched hobbies and bookmarked
  videos to a personal dashboard.
- Auto-generated starter-gear shopping list with Amazon affiliate links.
- Swap the in-memory rate limiter for Upstash Redis for real multi-instance
  limits.
=======
# HobbyHaven

HobbyHaven is an immersive portal where an AI chat and "Fate's Roulette" make discovering new hobbies effortless. My custom navigation system ensures a seamless, thumb-friendly journey that always guides you home.

## 🚀 The Experience
Finding a new hobby can be overwhelming. HobbyHaven solves this by turning hobby discovery into a guided, interactive journey. 
* **AI Chat:** Get personalized hobby recommendations.
* **Fate's Roulette:** Take a chance on a curated, destiny-driven hobby track.
* **Smart Navigation:** A custom, state-driven system that remembers your path, ensuring you never get lost in the portals.

## 🛠️ Built With
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Experience:** Designed for seamless, mobile-first interaction.

## 💡 Why This Project?
I built HobbyHaven to solve "navigation fatigue." By moving beyond standard browser history, I created a web experience that feels like a cohesive space, making exploration intuitive, responsive, and fun.
>>>>>>> e21931ad33a6094e452acaa8ebed183504bbfabb
