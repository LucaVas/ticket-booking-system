import type { Database } from '@/database'
import type { Screenings } from '@/database'


export default (db: Database) => ({
  findAll: async (limit = 10, offset = 0) =>
    db.selectFrom('screenings').selectAll().limit(limit).offset(offset).execute(),

  // findByIds: async (ids: number[]) =>
  //   db.selectFrom('screenings').selectAll().where('id', 'in', ids).execute(),
})

