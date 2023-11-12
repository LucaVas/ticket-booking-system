import { Router } from 'express';
import type { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository from './repository';
import BadRequest from '@/utils/errors/BadRequest';
import NotFound from '@/utils/errors/NotFound';

export default (db: Database) => {
  const repository = buildRepository(db);
  const router = Router();

  router.delete(
    '/:id',
    jsonRoute(async req => {
      const screeningId = parseInt(req.params.id);

      if (!Number.isInteger(screeningId)) {
        throw new BadRequest('Please provide a numeric screening ID.');
      }

      const deletedScreening =
        await repository.deleteScreeningById(screeningId);

      if (!deletedScreening)
        throw new NotFound(`Screening with id ${screeningId} cannot be found.`);

      return deletedScreening;
    })
  );

  return router;
};
