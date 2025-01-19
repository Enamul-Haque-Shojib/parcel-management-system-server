import { z } from 'zod';

const authRegisterValidationSchema = z.object({
  body: z.object({
    authName: z.string().min(1, 'Auth Name is required').optional(),
    email: z.string().email('Invalid email address'),
    authImgUrl: z.string({ message: 'Auth Image is required' }).optional(),
    authPhoneNumber: z
      .string()
      .min(1, 'Auth Phone number is required')
      .optional(),
  }),
});

const updateAuthInfoValidationSchema = z.object({
  body: z.object({
    authName: z.string().optional(),
    email: z.string().email().optional(),
    authImgUrl: z.string().optional(),
    authPhoneNumber: z.string().optional(),
  }),
});

const userReviewValidationSchema = z.object({
  body: z.object({
    review: z.string().min(1, 'Review is required'),
  }),
});

export const authValidationSchema = {
  authRegisterValidationSchema,
  updateAuthInfoValidationSchema,
  userReviewValidationSchema,
};
