import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import createApp from '@/app';
import { createFor } from '@tests/utils/records';
import testUsers from './bootstrap/testUsers';
import testMovies from './bootstrap/testMovies';
import testScreenings from './bootstrap/testScreenings';
import testBookings from './bootstrap/testBookings';

const db = await createTestDatabase();
const app = createApp(db);

const createUsers = createFor(db, 'users');
const createMovies = createFor(db, 'movies');
const createScreenings = createFor(db, 'screenings');
const createBookings = createFor(db, 'bookings');

beforeAll(async () => {
  await createUsers(testUsers);
  await createMovies(testMovies);
  await createScreenings(testScreenings);
  await createBookings(testBookings);
});

afterAll(async () => {
  db.destroy();
});

describe('GET', () => {
  it('should return a list of bookings for existing user', async () => {
    const { body } = await supertest(app).get('/users/1/bookings').expect(200);

    const expected = {
      username: 'lucavassos',
      bookings: [
        {
          screeningId: 1,
          timestamp: '2023-11-01T21:15:00.000Z',
          movieTitle: 'Inception',
          ticketsBooked: {
            totalNumber: 2,
            seats: [
              {
                row: 'F',
                seat: 7,
                bookedAt: '2023-11-12T14:27:31.352Z',
              },
              {
                row: 'F',
                seat: 8,
                bookedAt: '2023-11-12T14:27:31.352Z',
              },
            ],
          },
        },
        {
          screeningId: 2,
          timestamp: '2023-11-01T19:45:00.000Z',
          movieTitle: 'Sherlock Holmes',
          ticketsBooked: {
            totalNumber: 1,
            seats: [
              {
                row: 'G',
                seat: 2,
                bookedAt: '2023-11-12T14:27:31.352Z',
              },
            ],
          },
        },
      ],
    };
    expect(body).toEqual(expected);
  });

  it('should return an empty list of bookings if user has no tickets booked', async () => {
    const { body } = await supertest(app).get('/users/2/bookings').expect(200);

    const expected = {
      username: 'ajanka',
      bookings: [],
    };

    expect(body).toEqual(expected);
  });

  it('should return 400 if id is not numeric', async () => {
    const { body } = await supertest(app)
      .get('/users/one/bookings')
      .expect(400);

    expect(body.error.message).toBe('Please provide a numeric user ID.');
  });

  it('should return 404 if user does not exist', async () => {
    const { body } = await supertest(app).get('/users/4/bookings').expect(404);

    expect(body.error.message).toBe('User with id 4 does not exist.');
  });

  it('should return 404 if unsupported users routes are reached', async () => {
    await supertest(app).post('/users/1').expect(405);
    await supertest(app).patch('/users/1').expect(405);
    await supertest(app).put('/users/1').expect(405);
    await supertest(app).delete('/users/1').expect(405);
  });

  it('should return 404 if unsupported booking routes are reached', async () => {
    await supertest(app).post('/users/1/bookings').expect(405);
    await supertest(app).patch('/users/1/bookings').expect(405);
    await supertest(app).put('/users/1/bookings').expect(405);
    await supertest(app).delete('/users/1/bookings').expect(405);
  });
});
