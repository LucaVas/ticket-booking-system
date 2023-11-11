import { Router } from 'express';
import type { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRespository from './repository';
import BadRequest from '@/utils/errors/BadRequest';
import { parseId } from './schema';

export default (db: Database) => {
  const messages = buildRespository(db);
  const router = Router();

  router.get(
    '/',
    jsonRoute(async req => {
      const stringIds = req.query.id;

      if (stringIds && typeof stringIds === 'string') {
        const ids = stringIds.split(',').map(id => parseId(Number(id)));
        const movies = await messages.findByIds(ids);
        return movies;
      }

      throw new BadRequest('Movies ids are required.');
    })
  );

  return router;
};
