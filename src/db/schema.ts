import { pgTable, serial, varchar, timestamp, doublePrecision, boolean, uuid, date } from 'drizzle-orm/pg-core';

export const gamesTable = pgTable('games', {
  id: serial('id').primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  igdbId: varchar({ length: 50 }),
  name: varchar({ length: 255 }).notNull(),
  cover: varchar({ length: 255 }),
  platform: varchar({ length: 50 }),
  status: varchar({ length: 50 }),
  rating: doublePrecision('rating'),
  platinum: boolean().default(false),
  finishedAt: date('finishedAt'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  profilepic: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  birthDate: date("birth_date").notNull(),
  preferredPlatform: varchar({ length: 50 }),
  twitchToken: varchar('twitch_token', { length: 255 }),
  twitchTokenType: varchar('twitch_token_type', { length: 50 }),
  twitchTokenExpireDate: timestamp('twitch_token_expiredate'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})