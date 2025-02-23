import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatisticsServices } from './Statistics.services';

const numberBookedDeliveredUsingApp = catchAsync(async (req, res) => {
  const numberData =
    await StatisticsServices.numberBookedDeliveredUsingAppIntoDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'successfully calculated number',
    data: numberData,
  });
});

const topDeliverThreeMen = catchAsync(async (req, res) => {
  const numberData = await StatisticsServices.topDeliverThreeMenIntoDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'successfully calculated number',
    data: numberData,
  });
});

const statisticsForChart = catchAsync(async (req, res) => {
  const barChart = await StatisticsServices.statisticsForBarChartFromDB();
  const lineChart = await StatisticsServices.statisticsForLineChartFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'successfully calculated number',
    data: { barChart, lineChart },
  });
});
const statisticsAuthParcel = catchAsync(async (req, res) => {
  const result = await StatisticsServices.statisticsAuthParcelFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'successfully calculated number',
    data: result,
  });
});

const dashboardStatistics = catchAsync(async (req, res) => {
  const result = await StatisticsServices.dashboardStatisticsFromDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'successfully calculated for dashboard statistics',
    data: result,
  });
});

export const StatisticsControllers = {
  topDeliverThreeMen,
  numberBookedDeliveredUsingApp,
  statisticsForChart,
  statisticsAuthParcel,
  dashboardStatistics
};
