# GameVault API

A serverless REST API built with AWS Lambda for managing personal game collections. Track your games, rate them, manage backlog, and search for games using IGDB integration.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Games](#games)
  - [Search](#search)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)

## Overview

GameVault is a personal game collection management system that allows users to:
- Add and manage games in their collection
- Rate games and track platinum achievements
- Organize games by status (Backlog, Playing, Completed, etc.)
- Search for games via IGDB (Internet Game Database) integration
- Filter and paginate through their collection

## Tech Stack

- **Runtime**: Node.js 22.x (ARM64)
- **Framework**: Serverless Framework v4
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **External API**: Twitch/IGDB API for game data
- **Cloud Provider**: AWS Lambda
- **Region**: us-east-1

## Project Architecture

The project follows a clean architecture pattern with the following structure:

```
src/
├── controllers/        # Request handlers and business logic
│   ├── auth/          # Authentication controllers
│   ├── AddGameController.ts
│   ├── ListGamesController.ts
│   ├── GetGameByIdController.ts
│   ├── UpdateGameByIdController.ts
│   ├── DeleteGameByIdController.ts
│   └── SearchGameController.ts
├── functions/         # Lambda function handlers
├── db/               # Database configuration and schema
├── schemas/          # Zod validation schemas
├── services/         # External service integrations (IGDB)
├── domain/           # Domain logic (Twitch token management)
├── utils/            # Utility functions (HTTP responses)
├── types/            # TypeScript type definitions
└── lib/              # Libraries (JWT)
```

### Architecture Flow
1. **API Gateway** → Receives HTTP requests
2. **Lambda Function** → Routes to appropriate controller
3. **Controller** → Validates request, executes business logic
4. **Database** → Drizzle ORM manages PostgreSQL operations
5. **Response** → Returns standardized HTTP response

## Getting Started

### Prerequisites
- Node.js 22.x or higher
- npm
- PostgreSQL database (Neon recommended)
- AWS account (for deployment)
- Twitch Developer account (for IGDB API access)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd gamevault
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with required environment variables:
```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
JWT_SECRET=your-secret-key
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret
```

4. Push database schema
```bash
npm run db:push
```

5. Run locally
```bash
npm run dev
```

6. Deploy to AWS
```bash
npm run deploy
```

## API Documentation

Base URL: `https://your-api-gateway-url.amazonaws.com/`

### Authentication

#### Sign Up
Create a new user account.

**Endpoint**: `POST /signup`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "birthDate": "1990-01-15",
  "preferredPlatform": "PlayStation 5"
}
```

**Response** (201 Created):
```json
{
  "accessToken": "eyJhbGcI6IkpXVCJ9..."
}
```

**Validations**:
- `name`: Required, minimum 1 character
- `email`: Valid email format
- `password`: Minimum 8 characters
- `birthDate`: ISO date format (YYYY-MM-DD)
- `preferredPlatform`: Must be one of the supported platforms

**Error Response** (409 Conflict):
```json
{
  "error": "This email is already in use!"
}
```

---

#### Sign In
Authenticate an existing user.

**Endpoint**: `POST /signin`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGcCI6IkpXVCJ9...",
  "name": "John Doe",
  "preferredPlatform": "PlayStation 5"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid credentials."
}
```

---

### Games

All game endpoints require authentication. Include the JWT token in the `Authorization` header:
```
Authorization: Bearer <your-token>
```

#### Add Game
Add a new game to your collection.

**Endpoint**: `POST /games`

**Request Body**:
```json
{
  "name": "The Last of Us Part II",
  "platform": "PlayStation 5",
  "status": "Backlog",
  "rating": 4.5,
  "platinum": false,
  "finishedAt": null
}
```

**Response** (201 Created):
```json
{
  "gameId": 123,
  "message": "Game added!"
}
```

**Field Definitions**:
- `name`: Required, game title
- `platform`: Optional, must be one of the supported platforms
- `status`: Required, one of: "Backlog", "Replay", "Playing", "On Hold", "Abandoned", "Completed"
- `rating`: Optional, number between 0-5, must be multiple of 0.5
- `platinum`: Optional, boolean indicating platinum trophy achievement
- `finishedAt`: Optional, ISO date when game was finished

---

#### List Games
Retrieve paginated list of games in your collection.

**Endpoint**: `GET /games`

**Query Parameters**:
- `page` (optional): Page number, default is 1
- `filter` (optional): Filter by status
  - `backlog`: Only show games with status "Backlog"
  - `notBacklog`: Show all games except those in "Backlog"

**Example**: `GET /games?page=1&filter=backlog`

**Response** (200 OK):
```json
{
  "games": [
    {
      "id": 123,
      "name": "The Last of Us Part II",
      "platform": "PlayStation 5",
      "rating": 4.5,
      "platinum": false,
      "status": "Backlog"
    }
  ],
  "page": 1,
  "pageSize": 50
}
```

**Notes**:
- Returns 50 games per page
- Games are ordered by creation date (newest first)
- Only returns games owned by the authenticated user

---

#### Get Game by ID
Retrieve details of a specific game.

**Endpoint**: `GET /games/{gameId}`

**Parameters**:
- `gameId`: The ID of the game

**Response** (200 OK):
```json
{
  "game": {
    "id": 123,
    "name": "The Last of Us Part II",
    "platform": "PlayStation 5",
    "rating": 4.5,
    "platinum": false,
    "status": "Backlog",
    "finishedAt": null,
    "createdAt": "2024-10-02T12:00:00.000Z"
  }
}
```

**Error Response** (404/500):
```json
{
  "error": "Game ID not found"
}
```

---

#### Update Game
Update an existing game in your collection.

**Endpoint**: `PUT /games/{gameId}`

**Parameters**:
- `gameId`: The ID of the game to update

**Request Body**:
```json
{
  "name": "The Last of Us Part II",
  "platform": "PlayStation 5",
  "status": "Completed",
  "rating": 5.0,
  "platinum": true,
  "finishedAt": "2024-10-05"
}
```

**Response** (200 OK):
```json
{
  "message": "Game updated!"
}
```

**Notes**:
- All fields follow the same validation rules as Add Game
- User can only update their own games
- Returns error if game not found

---

#### Delete Game
Remove a game from your collection.

**Endpoint**: `DELETE /games/{gameId}`

**Parameters**:
- `gameId`: The ID of the game to delete

**Response** (200 OK):
```json
{
  "message": "Game deleted."
}
```

**Error Response**:
```json
{
  "error": "Game ID not found"
}
```

---

### Search

#### Search Game
Search for games using IGDB database.

**Endpoint**: `GET /search`

**Query Parameters**:
- `search` (required): Search term/game name
- `platform` (optional): Platform ID to filter results (see [Supported Platforms](#supported-platforms))

**Example**: `GET /search?search=last+of+us&platform=167`

**Response** (200 OK):
```json
{
  "games": [
    {
      "id": 1009,
      "name": "The Last of Us",
      "slug": "the-last-of-us",
      "platforms": [
        {
          "name": "PlayStation 5"
        }
      ],
      "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r4h.jpg"
    }
  ]
}
```

**Notes**:
- Requires Twitch API authentication (handled automatically)
- Returns up to 30 results
- Cover images are formatted as large thumbnails
- Games without cover images return `null` for the `cover` field

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `TWITCH_CLIENT_ID` | Twitch application client ID for IGDB API | Yes |
| `TWITCH_CLIENT_SECRET` | Twitch application client secret for IGDB API | Yes |

## Database Schema

### Users Table
```typescript
{
  id: uuid (primary key)
  name: varchar(255)
  email: varchar(255) unique
  password: varchar(255) hashed
  birthDate: date
  preferredPlatform: varchar(50)
  twitchToken: varchar(255)
  twitchTokenType: varchar(50)
  twitchTokenExpireDate: timestamp
  createdAt: timestamp
}
```

### Games Table
```typescript
{
  id: serial (primary key)
  userId: uuid (foreign key → users.id, cascade delete)
  name: varchar(255)
  platform: varchar(50)
  status: varchar(50)
  rating: double precision
  platinum: boolean (default: false)
  finishedAt: date
  createdAt: timestamp
}
```

## Supported Platforms

| Platform | ID |
|----------|-----|
| PC (Microsoft Windows) | 6 |
| PlayStation | 7 |
| PlayStation 2 | 8 |
| PlayStation 3 | 9 |
| PlayStation 4 | 48 |
| PlayStation 5 | 167 |
| Xbox Series X\|S | 169 |
| Xbox One | 49 |
| Nintendo Switch | 130 |

## Game Status Values

- `Backlog`: Game in your backlog, not started
- `Playing`: Currently playing
- `Completed`: Finished the game
- `On Hold`: Started but paused
- `Abandoned`: Started but won't complete
- `Replay`: Planning to replay

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Run API locally with serverless-offline |
| `npm run deploy` | Deploy to AWS Lambda |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes directly to database |
| `npm run db:studio` | Open Drizzle Studio for database management |

## Error Responses

The API uses standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input/validation error |
| 401 | Unauthorized - Invalid or missing authentication |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

**Standard Error Format**:
```json
{
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## License

ISC

## Author

João Fernandes (joaofernandesdev)
