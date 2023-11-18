import { z } from 'zod';

const putSchema = z.object({
  totalTickets: z
    .number({
      invalid_type_error: 'Provide a numeric number of tickets.',
    })
    .int(),
});

const postSchema = z.object({
  timestamp: z.string().length(25, {
    message:
      'Timestamp format is incorrect, should be yyyy-MM-ddThh:mm:SS.ssssZ',
  }),
  movieId: z.number().int().positive(),
  totalTickets: z
    .number({
      invalid_type_error: 'Provide a numeric number of tickets.',
    })
    .int(),
});

export const parsePutRecord = (record: unknown) => putSchema.parse(record);
export const parsePostRecord = (record: unknown) => postSchema.parse(record);
