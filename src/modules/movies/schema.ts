import { z } from 'zod';

const schema = z.object({
  id: z.coerce
    .number({
      required_error: 'Number movie id is required.',
      invalid_type_error: 'Movies ids must be of numeric type.',
    })
    .int()
    .positive(),
});

export const parseId = (id: unknown) => schema.shape.id.parse(id);
