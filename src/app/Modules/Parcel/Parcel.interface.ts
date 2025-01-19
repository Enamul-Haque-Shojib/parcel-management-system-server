/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export type TParcel = {
    parcelNumber:string;
    name: string;
    email: string;
    senderPhoneNumber: string;
    parcelType: 'Small' | 'Medium' | 'Large' | 'Oversized';
    parcelWeight: number;
    price: number;
    receiverName: string;
    receiverPhoneNumber: string;
    parcelDeliveryAddress: string;
    bookingDate: Date;
    requestedDeliveryDate: string;
    ApproximateDeliveryDate: string;
    deliveryMan: string;
    bookingStatus: 'Pending' | 'On the way' | 'returned' | 'Delivered' | 'Canceled';
    deliveryAddressLatitude: string;
    deliveryAddressLongitude: string;
    isDeleted: boolean;
}

export interface ParcelStaticModel extends Model<TParcel> {
    isParcelExistById(id: string): Promise<TParcel>

}


