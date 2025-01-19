import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ParcelControllers } from './Parcel.controllers';
import { parcelValidationSchema } from './Parcel.validation';

const router = express.Router();

router.post(
  '/create-parcel',
  validateRequest(parcelValidationSchema.createParcelValidationSchema),
  ParcelControllers.createParcel,
);
router.patch(
  '/update-parcel/:id',
  validateRequest(parcelValidationSchema.updateParcelValidationSchema),
  ParcelControllers.updateParcel,
);
router.get(
  '/',

  ParcelControllers.getAllParcels,
);
router.get('/:id', ParcelControllers.getSingleParcel);
router.delete('/delete-parcel/:id', ParcelControllers.deleteSingleParcel);

export const ParcelRoutes = router;
