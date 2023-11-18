import { z } from 'zod';

const putSchema = z.object({
  totalTickets: z
    .number({
      invalid_type_error: 'Provide a numeric number of tickets.',
    })
    .int(),
});

const postSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date format is incorrect, required: yyyy-MM-dd',
  }),
  time: z.string().regex(/^[0-1][0-9]:[0-5][0-9]$|^[2][0-3]:[0-5][0-9]$/, {
    message: 'Time format is incorrect, required: hh:MM',
  }),
  movieId: z.number().int().positive(),
  totalTickets: z
    .number({
      invalid_type_error: 'Provide a numeric number of tickets.',
    })
    .int(),
});

const bookingSchema = z.object({
  username: z.string().min(1),
  ticketsQuantity: z.number().int().positive(),
  seats: z.array(
    z.object({
      row: z.string().length(1).toUpperCase(),
      seat: z.number().min(1)
    })
  )
});

export const parsePutRecord = (record: unknown) => putSchema.parse(record);
export const parsePostRecord = (record: unknown) => postSchema.parse(record);
export const parseBookingRecord = (record: unknown) => bookingSchema.parse(record)
