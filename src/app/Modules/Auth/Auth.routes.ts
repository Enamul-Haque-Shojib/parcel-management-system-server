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
  auth(AuthRole.Admin, AuthRole.DeliverMan, AuthRole.User),
  validateRequest(authValidationSchema.updateAuthInfoValidationSchema),
  AuthControllers.updateAuth,
);
router.get(
  '/',

  AuthControllers.getAllAuths,
);
router.get(
  '/deliver-man',
  auth(AuthRole.Admin, AuthRole.DeliverMan),
  AuthControllers.getAllDeliverMen,
);
router.delete(
  '/delete-auth/:id',
  auth(AuthRole.Admin),
  AuthControllers.deleteSingleAuth,
);
router.patch(
  '/review-user/:id',
  auth(AuthRole.User),
  validateRequest(authValidationSchema.userReviewValidationSchema),
  AuthControllers.addUserReview,
);
router.get(
  '/get-reviews/',
  auth(AuthRole.Admin, AuthRole.DeliverMan),
  AuthControllers.getAllDeliverMenReviews,
);

router.get(
  '/get-reviews/:id',
  auth(AuthRole.Admin, AuthRole.DeliverMan),
  AuthControllers.getSingleDeliverManReviews,
);

router.patch('/manage-parcel/:id', AuthControllers.manageParcel);

router.patch(
  '/parcel-status/:id',

  AuthControllers.parcelStatusChange,
);

router.patch(
  '/auth-role/:id',

  AuthControllers.authRoleChange,
);

router.post('/jwt', AuthControllers.jwtToken);

export const AuthRoutes = router;
