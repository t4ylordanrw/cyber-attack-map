# Global Cyber Attack Map

An interactive global map visualizing the latest reported cyber attacks, categorized into:

- **Financial** (banks, payment systems, financial data)
- **Private Organisation** (companies, non-government organizations)
- **Critical Infrastructure** (energy, water, telecom, transportation, etc.)

Data is based on publicly reported incidents from news and official disclosures. The current dataset reflects incidents up to November 23, 2026.

## Features

- Search bar (title, location, description)
- Date range filter
- Category filters with live counts
- Loading states and empty-state messaging

## Deployment to Vercel

1. Push this folder to a GitHub repository.
2. Import the repository into [Vercel](https://vercel.com).
3. Vercel will automatically detect Next.js and deploy.

No environment variables are required for the basic version.

## Updating Data Daily

The attack data lives in `public/attacks.json`. To keep it current:

- Manually update the JSON with new incidents from reliable sources (CISA, company disclosures, Reuters, BleepingComputer, etc.).
- For automation: Set up a GitHub Action or Vercel Cron job that scrapes/summarizes recent cyber news (e.g., via RSS or a news API) and commits an updated `attacks.json`. A simple approach is a scheduled script using Python/BeautifulSoup or a Node script with a free news API, then pushing changes.

Example structure for new entries:
```json
{
  "id": 15,
  "category": "Critical Infrastructure",
  "title": "Example Attack",
  "location": "City, Country",
  "lat": 0.0,
  "lng": 0.0,
  "date": "2026-11-23",
  "description": "Brief factual summary...",
  "impact": "What was affected...",
  "source": "Source name"
}
```

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Tech Stack

- Next.js 14 (App Router)
- React Leaflet + Leaflet
- Tailwind CSS
- Static JSON data (easily updatable)

Data is for informational purposes only. Always verify with primary sources.
