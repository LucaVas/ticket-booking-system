import { Screenings } from '@/database';
import { Bookings } from '@/database/types';
import { Insertable, Selectable, Updateable } from 'kysely';

export type ScreeningRow = Screenings;
export type ScreeningRowWithoutId = Omit<ScreeningRow, 'id'>;
export type ScreeningRowInsert = Insertable<ScreeningRowWithoutId>;
export type ScreeningRowUpdate = Updateable<ScreeningRowWithoutId>;
export type ScreeningRowSelect = Selectable<ScreeningRow>;

export interface ModifiedScreening {
  id: number;
  date: string | null;
  time: string | null;
  totalTickets: number | null;
  ticketsLeft: number | null;
  movieId: number | null;
  movieTitle: string | null;
  movieYear: number | null;
}

export type ScreeningAndMovie = Omit<ModifiedScreening, 'ticketsLeft'>;

export type NewBookingSeatInformation = { row: string; seat: number };
export type NewBooking = {
  username: string;
  ticketsQuantity: number;
  seats: NewBookingSeatInformation[];
};

export type BookingRow = Bookings;
export type BookingRowWithoutId = Omit<BookingRow, 'id'>;
export type BookingRowInsert = Insertable<BookingRowWithoutId>;
export type BookingRowUpdate = Updateable<BookingRowWithoutId>;
export type BookingRowSelect = Selectable<BookingRow>;
