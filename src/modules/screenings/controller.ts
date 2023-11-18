import { Router } from 'express';
import type { Database } from '@/database';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import buildService from './service';
import { parseBookingRecord, parsePostRecord, parsePutRecord } from './schema';
import { StatusCodes } from 'http-status-codes';

export default (db: Database) => {
  const service = buildService(db);
  const router = Router();

  router
    .route('/')
    .get(
      jsonRoute(async () => {
        const screeningsAndMovies = await service.getScreeningsAndMovies();
        const modifiedScreenings = await Promise.all(
          screeningsAndMovies.map(
            async screening => await service.addTicketsLeft(screening)
          )
        );
        return modifiedScreenings;
      })
    )
    .post(
      jsonRoute(async req => {
        const newScreening = parsePostRecord(req.body);
        return service.createScreening(newScreening);
      }, StatusCodes.CREATED)
    )
    .put(unsupportedRoute)
    .patch(unsupportedRoute)
    .delete(unsupportedRoute);

  router
    .route('/:id')
    .post(
      jsonRoute(async req => {
        const screeningId = parseInt(req.params.id);
        const booking = parseBookingRecord(req.body);
        return service.createBooking(screeningId, booking);
      }, StatusCodes.CREATED)
    )
    .put(
      jsonRoute(async req => {
        const screeningId = parseInt(req.params.id);
        const { totalTickets } = parsePutRecord(req.body);
        return service.updateScreeningById(screeningId, totalTickets);
      })
    )
    .delete(
      jsonRoute(async req => {
        const screeningId = parseInt(req.params.id);
        return service.deleteScreeningById(screeningId);
      })
    )
    .get(unsupportedRoute)
    .patch(unsupportedRoute);

  return router;
};
