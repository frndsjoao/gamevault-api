# GameVault API

A serverless API for managing your personal game collection. Track games, ratings, achievements, and search for new games using IGDB.

## Features

- Add and manage games in your collection
- Rate games and track platinum achievements
- Organize by status (Backlog, Playing, Finished, etc.)
- Search games via IGDB integration
- User authentication with JWT

## Tech Stack

- Node.js 22.x with TypeScript
- Serverless Framework + AWS Lambda
- PostgreSQL (Neon) + Drizzle ORM
- Zod for validation
- IGDB API for game data

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
JWT_SECRET=your-secret-key
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret
```

3. Setup database:

```bash
npm run db:push
```

4. Run locally:

```bash
npm run dev
```

5. Deploy to AWS:

```bash
npm run deploy
```

## API Endpoints

All endpoints use `Authorization: Bearer <token>` header (except sign up/in)

### Authentication

**POST /signup** - Create account

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "birthDate": "1990-01-15",
  "preferredPlatform": "PlayStation 5"
}
```

**POST /signin** - Login

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Games

**POST /games** - Add game

```json
{
  "name": "The Last of Us Part II",
  "platform": "PlayStation 5",
  "status": "Backlog",
  "rating": 4.5,
  "platinum": false
}
```

**GET /games?page=1&filter=backlog** - List games (50 per page)

**GET /games/{id}** - Get game details

**PUT /games/{id}** - Update game

**DELETE /games/{id}** - Delete game

**GET /dashboard** - Get dashboard stats

### Search

**GET /search?search=last+of+us&platform=167** - Search IGDB

## Game Status

- `Backlog` - Not started
- `Playing` - Currently playing
- `Finished` - Finished
- `On Hold` - Paused
- `Abandoned` - Won't complete
- `Replay` - Planning to replay

## Supported Platforms

| Platform         | ID  |
| ---------------- | --- |
| PC               | 6   |
| PlayStation 5    | 167 |
| PlayStation 4    | 48  |
| Xbox Series X\|S | 169 |
| Xbox One         | 49  |
| Nintendo Switch  | 130 |

## Available Commands

```bash
npm run dev         # Run locally
npm run deploy      # Deploy to AWS
npm run db:push     # Update database schema
npm run db:studio   # Open database UI
```

---

Built by João Fernandes | [joaofernandesdev](https://github.com/joaofernandesdev)
