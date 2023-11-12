import { Bookings, Users } from '@/database';
import { Insertable, Selectable, Updateable } from 'kysely';

export type UserRow = Users;
export type UserRowWithoutId = Omit<UserRow, 'id'>;
export type UserRowInsert = Insertable<UserRowWithoutId>;
export type UserRowUpdate = Updateable<UserRowWithoutId>;
export type UserRowSelect = Selectable<UserRow>;

export type SeatInformation = { row: string; seat: number; bookedAt: string };
export type Booking = {
  screeningId: number;
  movieTitle: string;
  timestamp: string;
  ticketsBooked: {
    totalNumber: number;
    seats: SeatInformation[];
  };
};