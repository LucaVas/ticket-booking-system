import type { Database } from '@/database';
//import type { Screenings } from '@/database'

export default (db: Database) => ({
  findAll: async (limit = 10, offset = 0) =>
    db
      .selectFrom('screenings')
      .selectAll()
      .limit(limit)
      .offset(offset)
      .execute(),

  //   // findByIds: async (ids: number[]) =>
  //   //   db.selectFrom('screenings').selectAll().where('id', 'in', ids).execute(),

  getScreenings: async (limit = 10, offset = 0) => {
    // get all screenings
    const allScreenings = await db
      .selectFrom('screenings')
      .leftJoin('movies', 'screenings.movieId', 'movies.id')
      .select([
        'screenings.id as id',
        'timestamp',
        'totalTickets',
        'title',
        'movies.id as movieId',
        'year',
      ])
      .limit(limit)
      .offset(offset)
      .execute();
    console.log(allScreenings);
    // const moviesIds = allScreenings.map(screening => screening.movieId);
    // console.log(moviesIds);

    const ticketsBooked = await db
      .selectFrom('screenings')
      .leftJoin('movies', 'screenings.movieId', 'movies.id')
      .leftJoin('bookings', 'screenings.id', 'bookings.screeningId')
      // .select([
      //   'screenings.id as id',
      //   'timestamp',
      //   'totalTickets',
      //   'title',
      //   'movies.id as movieId',
      //   'year',
      //   'bookings.seat',
      // ])
      .selectAll()
      .execute();

    console.log(ticketsBooked);
  },
});
