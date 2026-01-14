import { drizzle } from 'drizzle-orm/d1';
export interface Env {
  DB: D1Database;
}
export const getDb = (dbBinding: D1Database) => {
  return drizzle(dbBinding);
};