import { model, Schema } from 'mongoose';
import { ParcelStaticModel, TParcel } from './Parcel.interface';
import { BookingStatus, ParcelType } from './Parcel.constant';

const parcelSchema = new Schema<TParcel, ParcelStaticModel>(
  {
    parcelNumber: { type: String, unique: true, required: true },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    senderPhoneNumber: {
      type: String,
      required: true,
    },
    parcelType: {
      type: String,
      enum: ParcelType,
      required: true,
    },
    parcelWeight: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverPhoneNumber: {
      type: String,
      required: true,
    },
    parcelDeliveryAddress: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now(),
    },
    requestedDeliveryDate: {
      type: String,
      required: true,
    },
    ApproximateDeliveryDate: {
      type: String,
      default: 'Pending',
    },
    deliveryMan: {
      type: String,
      default: 'Pending',
    },
    bookingStatus: {
      type: String,
      enum: {
        values: BookingStatus,
      },
      default: 'Pending',
    },
    deliveryAddressLatitude: {
      type: String,
      required: true,
    },
    deliveryAddressLongitude: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// parcelSchema.statics.isParcelExistsById = async function (id: string) {
//     return await ParcelModel.findById(id );
//   };

export const ParcelModel = model<TParcel, ParcelStaticModel>(
  'Parcel',
  parcelSchema,
);
