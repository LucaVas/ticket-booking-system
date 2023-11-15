import type { Database } from '@/database';
import buildRepository from './repository';
import { ScreeningRowSelect, ScreeningRowInsert } from './types/types';
import BadRequest from '@/utils/errors/BadRequest';
import NotFound from '@/utils/errors/NotFound';

export default (db: Database) => ({
  repository: buildRepository(db),

  async findAll(limit = 10, offset = 0) {
    return this.repository.findAll(limit, offset);
  },

  async deleteScreeningById(
    id: number
  ): Promise<ScreeningRowSelect | undefined> {
    if (!Number.isInteger(id)) {
      throw new BadRequest('Please provide a numeric screening ID.');
    }

    const deletedScreening = await this.repository.deleteScreeningById(id);
    if (!deletedScreening) {
      throw new NotFound(`Screening with ID ${id} cannot be found.`);
    }

    return deletedScreening;
  },

  async updateScreeningById(id: number, totalTickets: number): Promise<ScreeningRowSelect | undefined> {
    if (!Number.isInteger(id)) {
      throw new BadRequest('Please provide a numeric screening ID.');
    }

    const updatedScreening = await this.repository.updateScreeningById(id, totalTickets);
    if (!updatedScreening) {
      throw new NotFound(`Screening with ID ${id} cannot be found.`);
    }

    return updatedScreening;
  },

  async createScreening(screening: ScreeningRowInsert): Promise<ScreeningRowSelect> {
    return this.repository.createScreening(screening)
  }
});
