import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatisticsServices } from "./Statistics.services";


const numberBookedDeliveredUsingApp = catchAsync(async (req, res) => {
   
    const numberData = await StatisticsServices.numberBookedDeliveredUsingAppIntoDB();

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


  export const StatisticsControllers = {
    topDeliverThreeMen,
    numberBookedDeliveredUsingApp
    
  }