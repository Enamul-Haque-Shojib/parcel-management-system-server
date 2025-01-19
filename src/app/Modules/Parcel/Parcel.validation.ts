import { z } from 'zod';
import { ParcelType } from './Parcel.constant';

const createParcelValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    senderPhoneNumber: z.string().min(1, 'Phone number is required'),
    parcelType: z.enum(ParcelType),
    parcelWeight: z
      .number()
      .positive('Parcel weight must be a positive number'),
    price: z.number().positive('Price must be a positive number'),
    receiverName: z.string().min(1, 'Receiver name is required'),
    receiverPhoneNumber: z.string().min(1, 'Receiver phone number is required'),
    parcelDeliveryAddress: z
      .string()
      .min(1, 'Parcel delivery address is required'),
    requestedDeliveryDate: z.string(),
    deliveryAddressLatitude: z
      .string()
      .min(1, 'Delivery address latitude is required'),
    deliveryAddressLongitude: z
      .string()
      .min(1, 'Delivery address longitude is required'),
  }),
});
const updateParcelValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    senderPhoneNumber: z.string().optional(),
    parcelType: z.enum(['Small', 'Medium', 'Large', 'Oversized']).optional(),
    parcelWeight: z
      .number()
      .positive('Parcel weight must be a positive number')
      .optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    receiverName: z.string().optional(),
    receiverPhoneNumber: z.string().optional(),
    parcelDeliveryAddress: z.string().optional(),
    requestedDeliveryDate: z.string().optional(),
    deliveryAddressLatitude: z.string().optional(),
    deliveryAddressLongitude: z.string().optional(),
  }),
});

export const parcelValidationSchema = {
  createParcelValidationSchema,
  updateParcelValidationSchema,
};
