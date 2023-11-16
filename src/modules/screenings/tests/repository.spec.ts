import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import buildRepository from '../repository';

const db = await createTestDatabase();
const repository = buildRepository(db);

const createScreenings = createFor(db, 'screenings');
const createMovies = createFor(db, 'movies');
const createBookings = createFor(db, 'bookings');
const createUsers = createFor(db, 'users');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('movies').execute();
  await db.deleteFrom('screenings').execute();
});

describe('findAll', () => {
  it('should return a list of screenings in the database', async () => {
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
        timestamp: '2023-11-01T21:15:00.0000Z',
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
        seat: 'F4',
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

    const screenings = await repository.findAll();

    expect(screenings).toHaveLength(1);
    expect(screenings).toEqual([
      {
        id: 1,
        timestamp: '2023-11-01T21:15:00.0000Z',
        movieId: 816692,
        totalTickets: 100,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ]);
    repository.getScreenings();
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
      timestamp: '2023-11-01T21:15:00.0000Z',
      movieId: 816692,
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
      timestamp: '2023-11-01T21:15:00.0000Z',
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
      timestamp: '2023-11-01T21:15:00.0000Z',
      movieId: 816692,
      totalTickets: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await createMovies(movieTest);
    await createScreenings(screeningTest);

    const screening =
      await repository.updateScreeningById(1, 15);

    expect(screening).toEqual({
      ...screeningTest,
      totalTickets: 15
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
      timestamp: '2023-11-01T21:15:00.0000Z',
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
