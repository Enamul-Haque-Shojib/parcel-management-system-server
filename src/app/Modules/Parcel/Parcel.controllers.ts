import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ParcelServices } from './Parcel.services';

const createParcel = catchAsync(async (req, res) => {
  const result = await ParcelServices.createParcelIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Parcel successfully created',
    data: result,
  });
});

const updateParcel = catchAsync(async (req, res) => {
  const result = await ParcelServices.updateParcelIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Parcel successfully updated',
    data: result,
  });
});

const getSingleParcel = catchAsync(async (req, res) => {
  const result = await ParcelServices.getSingleParcelFromDB(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single Parcel successfully retrieved',
    data: result,
  });
});
const getAllParcels = catchAsync(async (req, res) => {
  const result = await ParcelServices.getAllParcelsFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Parcels successfully retrieved',
    data: result,
  });
});

const deleteSingleParcel = catchAsync(async (req, res) => {
  const result = await ParcelServices.deleteSingleParcelFromDB(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Parcel successfully deleted',
    data: result,
  });
});

export const ParcelControllers = {
  createParcel,
  updateParcel,
  getAllParcels,
  deleteSingleParcel,
  getSingleParcel,
};
