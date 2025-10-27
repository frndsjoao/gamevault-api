import {
  pgTable,
  serial,
  varchar,
  timestamp,
  doublePrecision,
  boolean,
  uuid,
  date,
  jsonb,
} from "drizzle-orm/pg-core"

export const gamesTable = pgTable("games", {
  id: serial().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  igdbId: varchar("igdb_id", { length: 50 }),
  name: varchar({ length: 255 }).notNull(),
  cover: varchar({ length: 255 }),
  platforms: jsonb(),
  selectedPlatform: varchar("selected_platform", { length: 50 }),
  rating: doublePrecision(),
  status: varchar({ length: 50 }),
  platinum: boolean().default(false),
  finishedAt: date("finished_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  avatar: varchar({ length: 750 }),
  birthdate: date().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  preferredPlatform: varchar("preferred_platform", { length: 50 }),
  twitchToken: varchar("twitch_token", { length: 255 }),
  twitchTokenType: varchar("twitch_token_type", { length: 50 }),
  twitchTokenExpireDate: timestamp("twitch_token_expiredate"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
