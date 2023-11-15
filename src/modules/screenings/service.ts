import type { Database } from '@/database';
import buildRepository from './repository';
import { ScreeningRowSelect } from './types/types';

export default (db: Database) => ({
  repository: buildRepository(db),

  async findAll(limit = 10, offset = 0) {
    return this.repository.findAll(limit, offset);
  },

  async deleteScreeningById(
    id: number
  ): Promise<ScreeningRowSelect | undefined> {
    return this.repository.deleteScreeningById(id);
  },
});
