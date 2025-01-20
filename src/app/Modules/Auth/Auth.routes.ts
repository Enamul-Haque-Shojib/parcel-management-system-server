import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidationSchema } from './Auth.validation';
import { AuthControllers } from './Auth.controllers';
import auth from '../../middlewares/auth';
import { AuthRole } from './Auth.constant';

const router = express.Router();

router.post(
  '/account/:email',
  validateRequest(authValidationSchema.authRegisterValidationSchema),
  AuthControllers.authAccount,
);

router.patch(
  '/update-auth/:id',
  auth(AuthRole.Admin),
  validateRequest(authValidationSchema.updateAuthInfoValidationSchema),
  AuthControllers.updateAuth,
);
router.get('/', AuthControllers.getAllAuths);
router.get('/deliver-man', AuthControllers.getAllDeliverMen);
router.delete('/delete-auth/:id', AuthControllers.deleteSingleAuth);
router.patch(
  '/review-user/:id',
  validateRequest(authValidationSchema.userReviewValidationSchema),
  AuthControllers.addUserReview,
);
router.get('/get-reviews/', AuthControllers.getAllDeliverMenReviews);
router.get('/get-reviews/:id', AuthControllers.getSingleDeliverManReviews);

router.patch('/manage-parcel/:id', AuthControllers.manageParcel);
router.patch('/parcel-status/:id', AuthControllers.parcelStatusChange);
router.patch('/auth-role/:id', AuthControllers.authRoleChange);
router.post('/jwt', AuthControllers.jwtToken);

export const AuthRoutes = router;
