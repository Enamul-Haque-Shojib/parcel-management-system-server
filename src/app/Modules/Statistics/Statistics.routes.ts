import express from 'express';

import { StatisticsControllers } from './Statistics.controllers';

const router = express.Router();

router.get(
  '/number-booked-delvered-usingapp',

  StatisticsControllers.numberBookedDeliveredUsingApp,
);
router.get(
  '/top-deliver-men',

  StatisticsControllers.topDeliverThreeMen,
);
router.get(
  '/chart',

  StatisticsControllers.statisticsForChart,
);
router.get(
  '/statistics-auth/:id',

  StatisticsControllers.statisticsAuthParcel,
);
router.post(
  '/dashboard-auth',

  StatisticsControllers.dashboardStatistics,
);

export const StatisticsRoutes = router;
