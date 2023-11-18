import { Database } from '@/database';
import buildRepository from './repository';
import NotFound from '@/utils/errors/NotFound';
import BadRequest from '@/utils/errors/BadRequest';
import { Booking, BookingList, Ticket } from './types/types';

export default (db: Database) => ({
  repository: buildRepository(db),

  async getTicketsByUserId(userId: number): Promise<BookingList> {
    const id = validateId(userId);

    const user = await this.repository.getUserById(id);
    if (!user) {
      throw new NotFound(`User with id ${userId} does not exist.`);
    }
    const tickets = await this.repository.getTicketsByUserId(id);

    const bookings: Booking[] = [];

    addScreenings(bookings, tickets);

    addSeats(bookings, tickets);

    return {
      username: user.username,
      bookings: bookings,
    };
  },
});

const addScreenings = (bookings: Booking[], tickets: Ticket[]): void => {
  tickets.filter(ticket => {
    if (!bookings.some(el => el.movieTitle === ticket.movieTitle)) {
      bookings.push({
        screeningId: ticket.screeningId,
        movieTitle: ticket.movieTitle,
        date: ticket.date,
        time: ticket.time,
        ticketsBooked: {
          totalNumber: 0,
          seats: [],
        },
      });
    }
  });
};

const addSeats = (bookings: Booking[], tickets: Ticket[]): void => {
  bookings.forEach(booking => {
    tickets.forEach(ticket => {
      if (ticket.screeningId === booking.screeningId) {
        booking.ticketsBooked.totalNumber++;
        booking.ticketsBooked.seats.push({
          row: ticket.row,
          seat: ticket.seat,
          bookedAt: ticket.bookedAt,
        });
      }
    });
  });
};

const validateId = (userId: number): number => {
  if (!Number.isInteger(userId)) {
    throw new BadRequest('Please provide a numeric user ID.');
  }

  return userId;
};
