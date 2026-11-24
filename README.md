# Cyber Attack Map

Interactive global map of recent reported cyber attacks, categorized into:
- **Financial** (red)
- **Private Organisation** (blue)
- **Critical Infrastructure** (orange)

Incidents from the last 2 days pulse on the map.

## Daily updates

A GitHub Action (`.github/workflows/update-attacks.yml`) runs every day at 06:00 UTC.

It currently runs `scripts/update-attacks.js` as a safe placeholder. To enable real automatic updates:
1. Extend the script with news APIs, RSS feeds, or other data sources.
2. Store any required API keys as repository secrets.
3. The Action will automatically commit and push changes to `public/attacks.json`.

You can also trigger the workflow manually from the Actions tab.

## Deploy

Deployed on Vercel from this repository. Any push to `main` that changes the JSON will update the live map after the next deployment.
