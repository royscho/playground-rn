import { z } from 'zod';

export const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email'),
  // Kept as a string, not z.coerce.number() — RN's TextInput only ever
  // produces strings, so the form's field type and the schema's input
  // type match exactly. Coercing to number here would split useForm's
  // generic into "input type" vs "output type", which zodResolver can't
  // reconcile against a single TFieldValues type parameter.
  age: z.string().refine(val => {
    const n = Number(val);
    return val.trim() !== '' && !Number.isNaN(n) && n >= 18 && n <= 120;
  }, 'Enter an age between 18 and 120'),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .regex(/^[\d\s+()-]+$/, 'Digits, spaces, +()- only'),
  company: z.string().min(1, 'Company is required'),
  bio: z.string().max(200, 'Keep it under 200 characters').optional(),
  acceptTerms: z.boolean().refine(val => val, {
    message: 'You must accept the terms',
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
