import { Database } from '@/database';
import buildRepository from './repository';
import NotFound from '@/utils/errors/NotFound';
import BadRequest from '@/utils/errors/BadRequest';
import { Booking } from './types/types';


export default (db: Database) => ({
  repository: buildRepository(db),

  async getTicketsByUserId(userId: number): Promise<Booking> {
    const id = validateId(userId);

    const user = await this.repository.getUserById(id);
    if (!user) {
      throw new NotFound(`User with id ${userId} does not exist.`);
    }
    const tickets = await this.repository.getTicketsByUserId(id);

    const bookings: Booking[] = [];

    tickets.forEach(ticket => {
      const existingBooking = bookings.find(
        booking => booking.movieTitle === ticket.movieTitle
      );

      if (existingBooking) {
        // Update existing booking
        existingBooking.ticketsBooked.totalNumber++;
        existingBooking.ticketsBooked.seats.push({
          row: ticket.row,
          seat: ticket.seat,
          bookedAt: ticket.bookedAt,
        });
      } else {
        // Create a new booking
        const newBooking: Booking = {
          screeningId: ticket.screeningId,
          movieTitle: ticket.movieTitle,
          timestamp: ticket.timestamp,
          ticketsBooked: {
            totalNumber: 1,
            seats: [
              {
                row: ticket.row,
                seat: ticket.seat,
                bookedAt: ticket.bookedAt,
              },
            ],
          },
        };

        bookings.push(newBooking);
      }
    });

    return bookings;

    // const response = {
    //   username: user.username,
    //   bookings: [] as Booking[],
    // };

    // tickets.filter(ticket => {
    //   if (!response.bookings.some(el => el.movieTitle === ticket.movieTitle)) {
    //     response.bookings.push({
    //       screeningId: ticket.screeningId,
    //       movieTitle: ticket.movieTitle,
    //       timestamp: ticket.timestamp,
    //       ticketsBooked: {
    //         totalNumber: 0,
    //         seats: [],
    //       },
    //     });
    //   }
    // });

    // // add number of tickets per booking
    // response.bookings.forEach(booking => {
    //   tickets.forEach(ticket => {
    //     if (ticket.screeningId === booking.screeningId) {
    //       booking.ticketsBooked.totalNumber++;
    //     }
    //   });
    // });

    // // add tickets seats
    // response.bookings.forEach(booking => {
    //   tickets.forEach(ticket => {
    //     if (ticket.screeningId === booking.screeningId) {
    //       booking.ticketsBooked.seats.push({
    //         row: ticket.row,
    //         seat: ticket.seat,
    //         bookedAt: ticket.bookedAt,
    //       });
    //     }
    //   });
    // });

    // return response;
  },
});

const validateId = (userId: number): number => {
  if (!Number.isInteger(userId)) {
    throw new BadRequest('Please provide a numeric user ID.');
  }

  return userId;
};
