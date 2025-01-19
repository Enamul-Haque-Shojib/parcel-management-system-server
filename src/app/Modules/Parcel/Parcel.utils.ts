import { ParcelModel } from './Parcel.model';

const findLastParcelNumber = async () => {
  const lastParcel = await ParcelModel.findOne(
    {},
    {
      parcelNumber: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();

  // return lastParcel?.parcelNumber;
  return lastParcel?.parcelNumber ? lastParcel.parcelNumber : undefined;
};

export const generateParcelNumber = async () => {
  let currentNumber = (0).toString();

  const lastParcelId = await findLastParcelNumber();

  if (lastParcelId) {
    currentNumber = lastParcelId.substring(2);
  }

  let incrementNumber = (Number(currentNumber) + 1).toString().padStart(4, '0');

  incrementNumber = `P-${incrementNumber}`;
  return incrementNumber;
};
