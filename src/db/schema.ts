import { pgTable, serial, varchar, timestamp, doublePrecision, boolean } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  platform: varchar('platform', { length: 100 }),
  rating: doublePrecision('rating'),
  platinum: boolean('platinum').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
