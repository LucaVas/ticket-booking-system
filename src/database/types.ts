import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Bookings {
  screeningId: number;
  userId: number;
  seat: string;
  bookedAt: string;
}

export interface Directors {
  movieId: number;
  personId: number;
}

export interface Movies {
  id: number | null;
  title: string;
  year: number | null;
}

export interface People {
  id: number | null;
  name: string;
  birth: number | null;
}

export interface Ratings {
  movieId: number;
  rating: number;
  votes: number;
}

export interface Screenings {
  id: Generated<number>;
  timestamp: string | null;
  movieId: number;
  totalTickets: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Stars {
  movieId: number;
  personId: number;
}

export interface Users {
  id: Generated<number>;
  username: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DB {
  bookings: Bookings;
  directors: Directors;
  movies: Movies;
  people: People;
  ratings: Ratings;
  screenings: Screenings;
  stars: Stars;
  users: Users;
}
