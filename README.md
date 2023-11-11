## Requirements

### Technical

- User and administrator inputs should be validated.
- Database schema changes must be done using migrations.
- Application code should have unit and integration tests ~ 80% - 95% coverage.

### Business

**Users** should be able to:

- `MOVIES` : get a list of movies with their id, title and year by providing a list of their IDs (e.g., /movies?id=133093,816692 should return 2 movies with these IDs, if they exist)
- `SCREENINGS` : get a list of screenings available for booking:
  - id
  - timestamp
  - totalTickets (number of tickets)
  - ticketsLeft (number of tickets left)
  - movies: (title and year).
- `TICKETS` : get a list of bookings (tickets) they have booked.
- `SCREENINGS` : create a booking (ticket) for movie screening that has some tickets left.

**Administrators** should be able to:

- `SCREENINGS` : create new viewing screenings for watching a movie that has a timestamp and a provided allocation of tickets.
  - request payload: movie id, screening timestamp(s), total tickets allocation;
  - response payload: movieId, timestamp, totalTickets, ticketsLeft
  - constraints: screening time must be in the future, total ticket allocation must be a positive integer
- `SCREENINGS` : delete viewing screenings while they are empty.
- `SCREENINGS` : change a screening's ticket allocation as long as it is not lower than the number of reserved tickets.

## Endpoints

`MOVIES`

```
/movies
```
> **Method**: GET

> **Params**: ?id=133093,816692

> **Description** : get movies information by id.

Response example:

```
  [
    {
      id: 133093,
      title: 'Pirates of Caribbean',
      year: 2010,
    },
    {
      id: 816692,
      title: 'Pirates of Hawaii',
      year: 2012,
    }
  ]
```
---
`SCREENINGS`

```
/screenings
```

> **Method**: GET

> **Description**: get screenings information.

Response example:
```
  [
    {
      movieId: 133093,
      movieTitle: 'Pirates of Caribbean',
      movieYear: 2010,
      screenings: [
        {
          id: 1,
          timestamp: '2023-11-06T21:15:00.0000Z',
          totalTickets: 100,
          ticketsLeft: 27
        }
      ]
    }
  ]
```
---
```
/screenings
```
> **Method**: POST

> **Description**: create new screening.
Request example:
```
  {
    date: '2023-11-06',
    time: '21:15',
    totalTickets: 100,
    movie_id: 133093
  }

```
---
```
/screenings/:id
```
> **Method**: POST

> **Description**: book tickets.

Request example:
```
  {
    username: 'lucavassos',
    bookingId: 5,
    ticketsQuantity: 3,
    seat: 'F7'
  }

```
---
```
/screenings/:id
```
> **Method**: DELETE

> **Description**: delete a screening.
---
```
/screenings/:id
```
> **Method**: PUT

> **Description**: update screening ticket allocation.
Request example:

```
  {
    totalTickets: 105
  }

```
---
`USERS`

```
users/:id/bookings
```

> **Method**: GET

> **Description**: get tickets booked by user.

Response example:

```
  {
    id: 1,
    username: 'lucavassos',
    bookings: [
      {
        id: 1,
        timestamp: '2023-11-06T21:15:00.0000Z',
        movieTitle: 'Pirate of Caribbean',
        ticketsBooked:
          {
            totalNumber: 3,
            seats: [F7, F8, F9]
          }
      }
    ]
  }

```

## Database schema

### Tables

`user`

| id | username | created_at | updated_at
| ----------- | ----------- | ----------- | ----------- |


`screening`

| id | timestamp | movie_id | created_at | updated_at
| ----------- | ----------- | ----------- | ----------- | ----------- |

`booking`

| screening_id | user_id | seat | booked_at
| ----------- | ----------- | ----------- | ----------- |

### Views

`screening_availabiliy`
| screening_id | timestamp | total_tickets | tickets_left
| ----------- | ----------- | ----------- | ----------- |

`tickets_booked_by_user`
| user_id | username | booking_id | movie_title | timestamp | seat
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |


## Setup

**Note:** For this exercise, we have provided an `.env` file with the database connection string. Normally, you would not commit this file to version control. We are doing it here for simplicity and given that we are using a local SQLite database.

## Database

This project should be used with the `movies.db` database in `data/` folder. It is the same database that we used in the previous exercise. You can download a fresh database [here](https://cdn.cs50.net/2022/fall/psets/7/movies.zip) or from [CS50](https://cs50.harvard.edu/x/2023/psets/7/movies/).

## Migrations

We can run migrations with the following command:

```bash
npm run migrate:latest
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```
