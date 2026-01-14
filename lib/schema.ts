import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nullifier_hash: text('nullifier_hash').notNull().unique(),
  wallet_address: text('wallet_address'),
  total_claimed: integer('total_claimed').default(0),
  last_claim_at: integer('last_claim_at', { mode: 'timestamp' }),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const claims = sqliteTable('claims', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_nullifier: text('user_nullifier').references(() => users.nullifier_hash),
  amount: integer('amount').notNull(),
  tx_hash: text('tx_hash'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});