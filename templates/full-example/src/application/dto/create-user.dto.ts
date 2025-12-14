import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;

