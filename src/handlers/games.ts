import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { gamesTable } from '../db/schema.js';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface CreateGameBody {
  name: string;
  platform: string;
  rating: number;
  platinum: boolean;
}

interface UpdateGameBody {
  name?: string;
  platform?: string;
  rating?: number;
  platinum?: boolean;
}

// Create Game
export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const db = getDb();
    const body: CreateGameBody = JSON.parse(event.body || '{}');

    if (!body.name || !body.platform || body.rating === undefined || body.platinum === undefined) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name, platform, rating, and platinum are required' }),
      };
    }

    const [newGame] = await db.insert(games).values({
      name: body.name,
      platform: body.platform,
      rating: body.rating,
      platinum: body.platinum,
    }).returning();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(newGame),
    };
  } catch (error) {
    console.error('Error creating game:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create game',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}

// Get Game by ID
export async function get(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const db = getDb();
    const gameId = parseInt(event.pathParameters?.id || '');

    if (isNaN(gameId)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid game ID' }),
      };
    }

    const [game] = await db.select().from(games).where(eq(games.id, gameId));

    if (!game) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Game not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(game),
    };
  } catch (error) {
    console.error('Error getting game:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to get game',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}

// List All Games
export async function list(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const db = getDb();
    const allGames = await db.select().from(games);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(allGames),
    };
  } catch (error) {
    console.error('Error listing games:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to list games',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}

// Update Game
export async function update(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const db = getDb();
    const gameId = parseInt(event.pathParameters?.id || '');
    const body: UpdateGameBody = JSON.parse(event.body || '{}');

    if (isNaN(gameId)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid game ID' }),
      };
    }

    const updateData: Partial<typeof games.$inferInsert> & { updatedAt?: Date } = {};
    if (body.name) updateData.name = body.name;
    if (body.platform) updateData.platform = body.platform;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.platinum !== undefined) updateData.platinum = body.platinum;
    updateData.updatedAt = new Date();

    if (Object.keys(updateData).length === 1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No fields to update' }),
      };
    }

    const [updatedGame] = await db
      .update(games)
      .set(updateData)
      .where(eq(games.id, gameId))
      .returning();

    if (!updatedGame) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Game not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedGame),
    };
  } catch (error) {
    console.error('Error updating game:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to update game',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}

// Delete Game
export async function deleteGame(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const db = getDb();
    const gameId = parseInt(event.pathParameters?.id || '');

    if (isNaN(gameId)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid game ID' }),
      };
    }

    const [deletedGame] = await db
      .delete(games)
      .where(eq(games.id, gameId))
      .returning();

    if (!deletedGame) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Game not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Game deleted successfully', game: deletedGame }),
    };
  } catch (error) {
    console.error('Error deleting game:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to delete game',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}
