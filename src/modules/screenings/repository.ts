import type { Database } from '@/database';
import { BookingRowSelect, NewBookingSeatInformation } from './types/types';
import { UserRowSelect } from '../users/types/types';
import {
  ScreeningRowSelect,
  ScreeningRowInsert,
} from './types/types';

export default (db: Database) => ({
  async getScreeningAndMovie() {
    return db
      .selectFrom('screenings')
      .leftJoin('movies', 'movies.id', 'screenings.movieId')
      .select([
        'screenings.id as id',
        'date',
        'time',
        'totalTickets',
        'movies.id as movieId',
        'title as movieTitle',
        'year as movieYear',
      ])
      .execute();
  },

  async getScreeningById(
    screeningId: number
  ): Promise<ScreeningRowSelect | undefined> {
    return db
      .selectFrom('screenings')
      .where('id', '=', screeningId)
      .selectAll()
      .executeTakeFirst();
  },

  async getBookingsNumber(screeningId: number) {
    const bookedNumObj = await db
      .selectFrom('bookings')
      .innerJoin('screenings', 'screenings.id', 'bookings.screeningId')
      .select(({ fn }) => [
        fn.count<number>('bookings.screeningId').as('bookedTickets'),
      ])
      .where('bookings.screeningId', '=', screeningId)
      .executeTakeFirst();

    return bookedNumObj?.bookedTickets;
  },

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

  async createBooking(
    screeningId: number,
    userId: number,
    seatInformation: NewBookingSeatInformation
  ): Promise<BookingRowSelect> {
    const timestamp = new Date().toISOString();
    return db
      .insertInto('bookings')
      .values({
        screeningId,
        userId,
        row: seatInformation.row,
        seat: seatInformation.seat,
        bookedAt: timestamp,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async getUserByUsername(
    username: string
  ): Promise<UserRowSelect | undefined> {
    return db
      .selectFrom('users')
      .where('username', '=', username)
      .selectAll()
      .executeTakeFirst();
  },
});