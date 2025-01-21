import express from 'express';
import { ParcelRoutes } from '../Modules/Parcel/Parcel.routes';
import { AuthRoutes } from '../Modules/Auth/Auth.routes';
import { StatisticsRoutes } from '../Modules/Statistics/Statistics.routes';


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
  {
    path: '/statistics',
    route: StatisticsRoutes,
  },
 
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
