import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import testUsers from './bootstrap/testUsers';
import testMovies from './bootstrap/testMovies';
import testScreenings from './bootstrap/testScreenings';
import testBookings from './bootstrap/testBookings';
import buildRepository from '../repository';

const db = await createTestDatabase();
const repository = buildRepository(db);
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

describe('bookings repository', () => {
  it('returns tickets booked by user', async () => {
    const expectedTickets = [
      {
        username: 'lucavassos',
        screeningId: 1,
        movieTitle: 'Inception',
        timestamp: '2023-11-01T21:15:00.000Z',
        row: 'F',
        seat: 7,
        bookedAt: '2023-11-12T14:27:31.352Z',
      },
      {
        username: 'lucavassos',
        screeningId: 1,
        movieTitle: 'Inception',
        timestamp: '2023-11-01T21:15:00.000Z',
        row: 'F',
        seat: 8,
        bookedAt: '2023-11-12T14:27:31.352Z',
      },
      {
        username: 'lucavassos',
        screeningId: 2,
        movieTitle: 'Sherlock Holmes',
        timestamp: '2023-11-01T19:45:00.000Z',
        row: 'G',
        seat: 2,
        bookedAt: '2023-11-12T14:27:31.352Z',
      },
    ];

    const tickets = await repository.getTicketsByUserId(1);

    expect(tickets).toEqual(expectedTickets);
  });

  it('returns no tickets if none available', async () => {
    const tickets = await repository.getTicketsByUserId(3);

    expect(tickets.length).toBe(0);
    expect(tickets).toStrictEqual([]);
  });

  it('return user by username', async () => {
    const user = await repository.getUserById(2);

    expect(user?.username).toBe('ajanka');
  });
});
