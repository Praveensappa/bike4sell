# Bike4Sell - Bike Marketplace + STLC

End-to-end web application and QA deliverables for a Bike Buying & Selling platform.

## Tech Stack
- Frontend: React + Vite (JavaScript)
- Backend: Node.js + Express.js
- Database: MySQL
- Automation: Playwright (JavaScript, Chrome)

## Modules
1. Authentication
2. Sell Bike
3. Browse Bikes
4. Search & Filter
5. Bike Details
6. Cart / Wishlist
7. Checkout & Payment
8. Orders & Reviews

## Run Backend
```bash
cd backend
npm install
npm run dev
```

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## Setup Database
Run:
- `database/schema.sql`
- `database/sample_data.sql`
- `database/queries.sql`

## Run Playwright
```bash
cd testing
npm install
npx playwright install chromium
npm test
```

## STLC Deliverables
See `docs/stlc/`:
- test-strategy.md
- test-plan.md
- test-scenarios.md
- test-data-sheet.md
- test-execution-report.md
- defect-report.md
- defect-lifecycle-tracker.md
- test-summary-report.md
