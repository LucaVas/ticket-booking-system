import type { Database } from '@/database';
import { bigint } from 'zod';
import { ScreeningRowSelect } from './types/types';
//import type { Screenings } from '@/database'

export default (db: Database) => ({
  findAll: async (limit = 10, offset = 0) =>
    db
      .selectFrom('screenings')
      .selectAll()
      .limit(limit)
      .offset(offset)
      .execute(),

  deleteScreeningById: async (
    id: number
  ): Promise<ScreeningRowSelect | undefined> => {
    return db
      .deleteFrom('screenings')
      .where('screenings.id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  //   // findByIds: async (ids: number[]) =>
  //   //   db.selectFrom('screenings').selectAll().where('id', 'in', ids).execute(),
});