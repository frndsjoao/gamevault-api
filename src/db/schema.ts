import { pgTable, serial, varchar, timestamp, doublePrecision, boolean, uuid, date } from 'drizzle-orm/pg-core';

export const gamesTable = pgTable('games', {
  id: serial('id').primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: varchar('name', { length: 255 }).notNull(),
  platform: varchar('platform', { length: 50 }),
  status: varchar('status', { length: 50 }),
  rating: doublePrecision('rating'),
  platinum: boolean('platinum').default(false),
  finishedAt: date('finishedAt'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  birthDate: date("birth_date").notNull(),
  preferredPlatform: varchar('preferredPlatform', { length: 50 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})