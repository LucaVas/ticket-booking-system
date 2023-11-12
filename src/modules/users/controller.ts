import { Router } from 'express';
import type { Database } from '@/database';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import buildService from './service';

export default (db: Database) => {
  const service = buildService(db);
  const router = Router();

  router.get(
    '/:id/bookings',
    jsonRoute(async req => {
      const userId = parseInt(req.params.id);
      const tickets = await service.getTicketsByUserId(userId);
      return tickets;
    })
  );

  router
    .route('/:id')
    .get(unsupportedRoute)
    .post(unsupportedRoute)
    .delete(unsupportedRoute)
    .patch(unsupportedRoute)
    .put(unsupportedRoute);

  router
    .route('/:id/bookings')
    .post(unsupportedRoute)
    .delete(unsupportedRoute)
    .patch(unsupportedRoute)
    .put(unsupportedRoute);

  return router;
};
