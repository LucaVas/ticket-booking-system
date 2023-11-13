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
  // clearing the tested table after each test
  await db.deleteFrom('movies').execute();
  await db.deleteFrom('screenings').execute();
});

describe('findAll', () => {
  it('should return a list of screenings in the database', async () => {
    // ARRANGE
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
        timestamp: '2023-11-01T21:15:00.0000Z',
        movieId: 816692,
        totalTickets: 100,
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

    // ACT
    const screenings = await repository.findAll();

    //console.log(screenings);
    // console.log(screeningTest);

    // ASSERT
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
});
