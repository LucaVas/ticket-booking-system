## Requirements

### Technical

- User and administrator inputs should be validated.
- Database schema changes must be done using migrations.
- Application code should have unit and integration tests ~ 80% - 95% coverage.

### Business

**Users** should be able to:

- [movie] get a list of movies with their id, title and year by providing a list of their IDs (e.g., /movies?id=133093,816692 should return 2 movies with these IDs, if they exist)
- [screening] get a list of screenings available for booking. Screenings should include session information (timestamp, number of tickets, number of tickets left) and movies: (title and year).
- [tickets] get a list of bookings (tickets) they have booked.
- [screening] create a booking (ticket) for movie screening that has some tickets left.

**Administrators** should be able to:

- [screening] create new viewing screenings for watching a movie that has a timestamp and a provided allocation of tickets.
  - input payload: movie id, screening timestamp(s), total tickets allocation;
  - output:
  - constraints: screening time must be in the future, total ticket allocation must be a positive integer
- [screening] delete viewing screenings while they are empty.
- [screening] change a screening's ticket allocation as long as it is not lower than the number of reserved tickets.

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
