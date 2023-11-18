import type { Database } from '@/database';
import { UserRowSelect, Ticket } from './types/types';

export default (db: Database) => ({
  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return db
      .selectFrom('bookings')
      .innerJoin('users', 'users.id', 'bookings.userId')
      .innerJoin('screenings', 'screenings.id', 'bookings.screeningId')
      .innerJoin('movies', 'movies.id', 'screenings.movieId')
      .where('users.id', '=', userId)
      .select([
        'users.username',
        'screenings.id as screeningId',
        'screenings.date',
        'screenings.time',
        'movies.title as movieTitle',
        'bookings.row',
        'bookings.seat',
        'bookings.bookedAt',
      ])
      .execute();
  },

  async getUserById(userId: number): Promise<UserRowSelect | undefined> {
    return db
      .selectFrom('users')
      .where('id', '=', userId)
      .selectAll()
      .executeTakeFirst();
  },
});
