import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ParcelControllers } from './Parcel.controllers';
import { parcelValidationSchema } from './Parcel.validation';
import auth from '../../middlewares/auth';
import { AuthRole } from '../Auth/Auth.constant';


const router = express.Router();

router.post(
    '/create-parcel',
    validateRequest(parcelValidationSchema.createParcelValidationSchema),
    ParcelControllers.createParcel
)
router.patch(
    '/update-parcel/:id',
    validateRequest(parcelValidationSchema.updateParcelValidationSchema),
    ParcelControllers.updateParcel
)
router.get(
    '/',
    // auth(AuthRole.User),
    ParcelControllers.getAllParcels
)
router.get(
    '/:id',
    ParcelControllers.getSingleParcel
)
router.delete(
    '/delete-parcel/:id',
    ParcelControllers.deleteSingleParcel
)


export const ParcelRoutes = router;