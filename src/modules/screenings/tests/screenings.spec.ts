import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';

const db = await createTestDatabase();
const app = createApp(db);
const createScreenings = createFor(db, 'screenings');
const createMovies = createFor(db, 'movies');
const createUsers = createFor(db, 'users');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('movies').execute();
  await db.deleteFrom('screenings').execute();
  await db.deleteFrom('users').execute();
});

describe('/screenings/:id', () => {
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
        date: '2023-11-01',
        time: '21:15',
        movieId: 816692,
        totalTickets: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await createMovies(movieTest);
      await createScreenings(screeningTest);

      const { body } = await supertest(app)
        .delete('/api/v1/screenings/1')
        .expect(200);

      expect(body.movieId).toEqual(816692);
      expect(body.time).toEqual('21:15');
    });

    it('should return 404 if screening to delete is not found', async () => {
      const { body } = await supertest(app)
        .delete('/api/v1/screenings/5')
        .expect(404);

      expect(body.error.message).toEqual(
        'Screening with ID 5 cannot be found.'
      );
    });

    it('should return 400 if id is invalid', async () => {
      const { body } = await supertest(app)
        .delete('/api/v1/screenings/one')
        .expect(400);

      expect(body.error.message).toEqual(
        'Please provide a numeric screening ID.'
      );
    });
  });

  describe('PUT', () => {
    it('should change number of total tickets of screenings', async () => {
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
        totalTickets: 100,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const ticketsChangeRequest = {
        totalTickets: 125,
      };

      await createMovies(movieTest);
      await createScreenings(screeningTest);

      const { body } = await supertest(app)
        .put('/api/v1/screenings/1')
        .send(ticketsChangeRequest)
        .expect(200);

      expect(body.movieId).toEqual(816692);
      expect(body.totalTickets).toEqual(ticketsChangeRequest.totalTickets);
    });

    it('should change number of total tickets of screenings if current value is null', async () => {
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
      const ticketsChangeRequest = {
        totalTickets: 125,
      };

      await createMovies(movieTest);
      await createScreenings(screeningTest);

      const { body } = await supertest(app)
        .put('/api/v1/screenings/1')
        .send(ticketsChangeRequest)
        .expect(200);

      expect(body.movieId).toEqual(816692);
      expect(body.totalTickets).toEqual(ticketsChangeRequest.totalTickets);
    });

    it('should throw error if request body is invalid', async () => {
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
        totalTickets: 100,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const ticketsChangeRequest = {
        totalTickets: 'one',
      };

      await createMovies(movieTest);
      await createScreenings(screeningTest);

      const { body } = await supertest(app)
        .put('/api/v1/screenings/1')
        .send(ticketsChangeRequest)
        .expect(400);

      expect(body.error.issues[0].message).toBe(
        'Provide a numeric number of tickets.'
      );
    });

    it('should throw error if ID is invalid', async () => {
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
        totalTickets: 100,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const ticketsChangeRequest = {
        totalTickets: 105,
      };

      await createMovies(movieTest);
      await createScreenings(screeningTest);

      const { body } = await supertest(app)
        .put('/api/v1/screenings/one')
        .send(ticketsChangeRequest)
        .expect(400);

      expect(body.error.message).toBe('Please provide a numeric screening ID.');
    });

    it('should throw error if screening cannot be found', async () => {
      const ticketsChangeRequest = {
        totalTickets: 105,
      };

      const { body } = await supertest(app)
        .put('/api/v1/screenings/10')
        .send(ticketsChangeRequest)
        .expect(404);

      expect(body.error.message).toBe('Screening with ID 10 cannot be found.');
    });
  });
});

describe('/screenings', () => {
  describe('POST', () => {
    it('should create a new screening', async () => {
      const movieTest = [
        {
          id: 816692,
          title: 'Interstellar',
          year: 2014,
        },
      ];

      const screeningTest = {
        date: '2023-11-01',
        time: '21:15',
        movieId: 816692,
        totalTickets: 107,
      };

      await createMovies(movieTest);

      const { body } = await supertest(app)
        .post('/api/v1/screenings')
        .send(screeningTest)
        .expect(201);

      expect(body.totalTickets).toEqual(107);
    });

    it('should throw error if body is invalid', async () => {
      const movieTest = [
        {
          id: 816692,
          title: 'Interstellar',
          year: 2014,
        },
      ];
      const screeningTest = {
        id: 1,
        movieId: 816692,
        totalTickets: null,
      };

      await createMovies(movieTest);

      const { body } = await supertest(app)
        .post('/api/v1/screenings')
        .send(screeningTest)
        .expect(400);

      expect(body.error.issues[0].message).toBe('Required');
    });

    it('should throw error if timestamp is invalid', async () => {
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
        time: '24:15',
        movieId: 816692,
        totalTickets: 100,
      };

      await createMovies(movieTest);

      const { body } = await supertest(app)
        .post('/api/v1/screenings')
        .send(screeningTest)
        .expect(400);

      expect(body.error.issues[0].message).toBe(
        'Time format is incorrect, required: hh:MM'
      );
    });

    it('should book tickets for screening', async () => {
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
        totalTickets: 107,
      };

      const bookingTest = {
        username: 'lucavassos',
        ticketsQuantity: 2,
        seats: [
          {
            row: 'F',
            seat: 7,
          },
          {
            row: 'F',
            seat: 8,
          },
        ],
      };

      const userTest = {
        username: 'lucavassos',
      };

      await createMovies(movieTest);
      await createScreenings(screeningTest);
      await createUsers(userTest);

      const { body } = await supertest(app)
        .post('/api/v1/screenings/1')
        .send(bookingTest)
        .expect(201);

      expect(body.length).toBe(2);
      expect(body[0].screeningId).toBe(1);
      expect(body[0].seat).toBe(7);
      expect(body[1].seat).toBe(8);
    });

    it('should throw error if user is not found', async () => {
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
        totalTickets: 107,
      };

      const bookingTest = {
        username: 'napoleon',
        ticketsQuantity: 2,
        seats: [
          {
            row: 'F',
            seat: 7,
          },
          {
            row: 'F',
            seat: 8,
          },
        ],
      };

      await createMovies(movieTest);
      await createScreenings(screeningTest);

      const { body } = await supertest(app)
        .post('/api/v1/screenings/1')
        .send(bookingTest)
        .expect(404);

      expect(body.error.message).toBe('User with username napoleon not found.');
    });

    it('should throw error if screening is not found', async () => {
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
        totalTickets: 107,
      };

      const bookingTest = {
        username: 'lucavassos',
        ticketsQuantity: 2,
        seats: [
          {
            row: 'F',
            seat: 7,
          },
          {
            row: 'F',
            seat: 8,
          },
        ],
      };

      const userTest = {
        username: 'lucavassos',
      };

      await createMovies(movieTest);
      await createScreenings(screeningTest);
      await createUsers(userTest);

      const { body } = await supertest(app)
        .post('/api/v1/screenings/2')
        .send(bookingTest)
        .expect(404);

      expect(body.error.message).toBe('Screening with ID 2 not found.');
    });
  });

  describe('GET', () => {
    it('should return all screenings', async () => {
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
          createdAt: timestamp,
          updatedAt: timestamp,
          totalTickets: null,
        },
      ];

      await createMovies(movieTest);
      await createScreenings(screeningTest);

      const { body } = await supertest(app)
        .get('/api/v1/screenings')
        .expect(200);
      expect(body).toEqual([
        {
          id: 1,
          date: '2023-11-01',
          time: '21:15',
          totalTickets: null,
          ticketsLeft: null,
          movieId: 816692,
          movieTitle: 'Interstellar',
          movieYear: 2014,
        },
      ]);
    });
  });
});
