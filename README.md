<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# GoQuick Driver

This project now includes:
- A **Mapbox-powered navigation map** in the in-ride screen.
- A **Node.js backend** with endpoints for driver bootstrap data, ride flow, and withdrawals.

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment variables in `.env.local`
   ```bash
   VITE_MAPBOX_TOKEN=your_mapbox_token
   VITE_API_BASE_URL=http://localhost:3001
   ```
3. Start backend API
   ```bash
   npm run dev:api
   ```
4. In a second terminal, start frontend
   ```bash
   npm run dev
   ```

## Backend endpoints

- `GET /api/health`
- `GET /api/bootstrap`
- `PATCH /api/driver/status`
- `PATCH /api/user`
- `GET /api/rides/next`
- `POST /api/rides/:id/accept`
- `POST /api/rides/:id/complete`
- `POST /api/withdrawals`
- `POST /api/withdrawals/:id/approve`
