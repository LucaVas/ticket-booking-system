import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import buildRepository from '../repository';

const db = await createTestDatabase();
const repository = buildRepository(db);

const createScreenings = createFor(db, 'screenings');
const createMovies = createFor(db, 'movies');
const createUsers = createFor(db, 'users');
const createBookings = createFor(db, 'bookings');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('movies').execute();
  await db.deleteFrom('screenings').execute();
});

describe('Screenings', () => {

  it('should return all screenings in the database joined with movies', async () => {
    const movieTest = [
      {
        id: 816692,
        title: 'Interstellar',
        year: 2014,
      },
    ];
    const timestamp = new Date().toISOString();
    const screeningTest = [
      {
        id: 1,
        date: '2023-11-01',
        time: '21:15',
        movieId: 816692,
        totalTickets: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];

    await createMovies(movieTest);
    await createScreenings(screeningTest);

    const screenings = await repository.getScreeningAndMovie();

    expect(screenings).toHaveLength(1);
    expect(screenings).toEqual([
      {
        id: 1,
        date: '2023-11-01',
        time: '21:15',
        totalTickets: null,
        movieId: 816692,
        movieTitle: 'Interstellar',
        movieYear: 2014,
      },
    ]);
  });

  it('should return number of bookings for the screening', async () => {
    const timestamp = new Date().toISOString();

    const movieTest = [
      {
        id: 816692,
        title: 'Interstellar',
        year: 2014,
      },
    ];

    const screeningTest = [
      {
        id: 1,
        date: '2023-11-01',
        time: '21:15',
        movieId: 816692,
        totalTickets: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];

    const bookingTest = [
      {
        screeningId: 1,
        userId: 1,
        row: 'F',
        seat: 4,
        bookedAt: '2023-11-01T21:15:00.0000Z',
      },
    ];

    const userTest = [
      {
        username: 'lucavassos',
      },
    ];
    await createMovies(movieTest);
    await createScreenings(screeningTest);
    await createUsers(userTest);
    await createBookings(bookingTest);

    const screenings = await repository.getScreeningAndMovie();
    const bookingsNumber = await repository.getBookingsNumber(screenings[0].id);

    expect(bookingsNumber).toBe(1);
  });

  it('should delete a screening', async () => {
    const timestamp = new Date().toISOString();

    const movieTest = [
      {
        id: 816692,
        title: 'Interstellar',
        year: 2014,
      },
    ];

    const screeningTest = {
      id: 1,
      date: '2023-11-01',
      time: '21:15',
      movieId: 816692,
      totalTickets: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await createMovies(movieTest);
    await createScreenings(screeningTest);

    const screening = await repository.deleteScreeningById(1);

    expect(screening).toEqual(screeningTest);
  });

  it('should delete a screening', async () => {
    const timestamp = new Date().toISOString();

    const movieTest = [
      {
        id: 816692,
        title: 'Interstellar',
        year: 2014,
      },
    ];

    const screeningTest = {
      id: 1,
      date: '2023-11-01',
      time: '21:15',
      movieId: 816692,
      totalTickets: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await createMovies(movieTest);
    await createScreenings(screeningTest);

    const screening = await repository.deleteScreeningById(1);

    expect(screening).toEqual(screeningTest);
  });

  it('should update a screening', async () => {
    const timestamp = new Date().toISOString();

    const movieTest = [
      {
        id: 816692,
        title: 'Interstellar',
        year: 2014,
      },
    ];

    const screeningTest = {
      id: 1,
      date: '2023-11-01',
      time: '21:15',
      movieId: 816692,
      totalTickets: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await createMovies(movieTest);
    await createScreenings(screeningTest);

    const screening = await repository.updateScreeningById(1, 15);

    expect(screening).toEqual({
      ...screeningTest,
      totalTickets: 15,
    });
  });

  it('should create a screening', async () => {
    const timestamp = new Date().toISOString();

    const movieTest = [
      {
        id: 816692,
        title: 'Interstellar',
        year: 2014,
      },
    ];

    const screeningTest = {
      id: 1,
      date: '2023-11-01',
      time: '21:15',
      movieId: 816692,
      totalTickets: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await createMovies(movieTest);

    const screening = await repository.createScreening(screeningTest);

    expect(screening).toEqual(screeningTest);
  });
});
