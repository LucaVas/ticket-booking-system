import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRespository from './repository'

export default (db: Database) => {
  const messages = buildRespository(db)
  const router = Router()

  router.get(
    '/',
    jsonRoute(async () => {
      // a hard-coded solution for your first controller test
      const ids = [133093, 816692] // TODO: get ids from query params
      const movies = await messages.findByIds(ids)

      return movies
    })
  )

  return router
}
