export const BookingStatus = [
  'Pending',
  'On the way',
  'Returned',
  'Delivered',
  'Canceled',
] as const;

export const ParcelType = ['Small', 'Medium', 'Large', 'Oversized'] as const;

export const parcelSearchableField = [
  'parcelNumber',
  'name',
  'email',
  'parcelType',
  'parcelWeight',
  'price',
  'senderPhoneNumber',
  'receiverName',
  'receiverPhoneNumber',
  'parcelDeliveryAddress',
  'bookingDate',
  'deliveryMan',
  'bookingStatus',
];
