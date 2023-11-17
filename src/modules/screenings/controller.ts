import { Router } from 'express';
import type { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildService from './service';
import { parsePostRecord, parsePutRecord } from './schema';
import { StatusCodes } from 'http-status-codes';

export default (db: Database) => {
  const service = buildService(db);
  const router = Router();

  router.get(
    '/',
    jsonRoute(async () => {
      const screeningsAndMovies = await service.getScreeningsAndMovies();
      const modifiedScreenings = await Promise.all(
        screeningsAndMovies.map(
          async screening => await service.addTicketsLeft(screening)
        )
      );
      return modifiedScreenings;
    })
  );

  router.post(
    '/',
    jsonRoute(async req => {
      const newScreening = parsePostRecord(req.body);
      return service.createScreening(newScreening);
    }, StatusCodes.CREATED)
  );

  router
    .put(
      '/:id',
      jsonRoute(async req => {
        const screeningId = parseInt(req.params.id);
        const { totalTickets } = parsePutRecord(req.body);
        return service.updateScreeningById(screeningId, totalTickets);
      })
    )
    .delete(
      '/:id',
      jsonRoute(async req => {
        const screeningId = parseInt(req.params.id);
        return service.deleteScreeningById(screeningId);
      })
    );

  return router;
};
