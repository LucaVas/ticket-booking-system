import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';
// import createDatabase from '@/database';

// const db = createDatabase(process.env.DATABASE_URL as string, {
//   readonly: true,
// });

const db = await createTestDatabase();
const app = createApp(db);
const createScreenings = createFor(db, 'screenings');
const createMovies = createFor(db, 'movies');

afterAll(() => db.destroy());

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('movies').execute();
  await db.deleteFrom('screenings').execute();
});

describe('GET', () => {
  it('should return all screenings', async () => {
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
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];

    await createMovies(movieTest);
    await createScreenings(screeningTest);

    const { body } = await supertest(app).get('/screenings').expect(200);

    expect(body).toEqual([
      {
        movieId: 816692,
        movieTitle: 'Interstellar',
        movieYear: 2014,
        screenings: [
          {
            id: 1,
            timestamp: '2023-11-06T21:15:00.0000Z',
            totalTickets: 100,
            ticketsLeft: 100,
          },
        ],
      },
    ]);
  });
});

describe('DELETE', () => {
  it('should delete screenings by id', async () => {
    const movieTest = [
      {
        id: 816692,
        title: 'Interstellar',
        year: 2014,
      },
    ];
    const timestamp = new Date().toISOString();
    const screeningTest = {
      timestamp: '2023-11-01T21:15:00.0000Z',
      movieId: 816692,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await createMovies(movieTest);
    await createScreenings(screeningTest);

    const { body } = await supertest(app).delete('/screenings/1').expect(200);

    expect(body.movieId).toEqual(816692);
    expect(body.timestamp).toEqual('2023-11-01T21:15:00.0000Z');
  });

  it('should return 404 if screening to delete is not found', async () => {
    const { body } = await supertest(app).delete('/screenings/5').expect(404);

    expect(body.error.message).toEqual('Screening with id 5 cannot be found.');
  });

  it('should return 400 if id is invalid', async () => {
    const { body } = await supertest(app).delete('/screenings/one').expect(400);

    expect(body.error.message).toEqual(
      'Please provide a numeric screening ID.'
    );
  });
});
