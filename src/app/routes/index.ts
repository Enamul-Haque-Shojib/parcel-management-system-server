import express from 'express';
import { ParcelRoutes } from '../Modules/Parcel/Parcel.routes';
import { AuthRoutes } from '../Modules/Auth/Auth.routes';




const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/parcels',
    route: ParcelRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
