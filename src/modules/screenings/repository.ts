import type { Database } from '@/database';
import { ScreeningRowSelect, ScreeningRowInsert } from './types/types';

export default (db: Database) => ({
  findAll: async (limit = 10, offset = 0) =>
    db
      .selectFrom('screenings')
      .selectAll()
      .limit(limit)
      .offset(offset)
      .execute(),

  async deleteScreeningById(
    id: number
  ): Promise<ScreeningRowSelect | undefined> {
    return db
      .deleteFrom('screenings')
      .where('screenings.id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async updateScreeningById(
    id: number,
    totalTickets: number
  ): Promise<ScreeningRowSelect | undefined> {
    return db
      .updateTable('screenings')
      .set({
        totalTickets,
      })
      .where('screenings.id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async createScreening(
    screening: ScreeningRowInsert
  ): Promise<ScreeningRowSelect> {
    const timestamp = new Date().toISOString();
    return db
      .insertInto('screenings')
      .values({
        ...screening,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  },
});
