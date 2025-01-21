import AppError from "../../errors/AppError";
import { AuthModel, UserReviewModel } from "../Auth/Auth.model";
import { ParcelModel } from "../Parcel/Parcel.model";



const numberBookedDeliveredUsingAppIntoDB = async () => {
  let numberBooked = 0;
  let numberDelivered = 0;
  let numberUsingApp = 0;
  const parcelData = await ParcelModel.find();
  numberBooked = parcelData.length;
  parcelData.forEach((parcel) =>{
    if(parcel.bookingStatus === "Delivered"){
        numberDelivered ++;
    }
  })
        
  const userData = await AuthModel.find();
  numberUsingApp = userData.length;



  return {numberBooked, numberDelivered, numberUsingApp}
};



const topDeliverThreeMenIntoDB = async () => {
  const listDeliverMen: { [key: string]: number }[] = [];
  const authData = await AuthModel.find();
  const parcelData = await ParcelModel.find();

  authData.forEach((auth) => {
      if (auth.role === "DeliverMan") {
          let deliverNumber = 0;

          parcelData.forEach((parcel) => {
              if (parcel.deliveryMan === auth.authId && parcel.bookingStatus === "Delivered") {
                  deliverNumber++;
              }
          });

          listDeliverMen.push({ [auth.authId]: deliverNumber });
      }
  });

  // Flatten listDeliverMen into an array of key-value pairs for easier sorting
  const flatList = listDeliverMen.map((entry) => {
      const [key, value] = Object.entries(entry)[0];
      return { id: key, deliveries: value };
  });

 
  flatList.sort((a, b) => b.deliveries - a.deliveries);

 
  const topThree = flatList.slice(0, 3);

  const reviewsData = await UserReviewModel.find();

  type DeliverManData = {
      name?: string;
      image?: string;
      delivered?: number;
      rating?: number;
  };

  const listTopThree: DeliverManData[] = [];
  topThree.forEach((man) => {
      const deliverManData: DeliverManData = {}; 

      authData.forEach((auth) => {
          if (man.id === auth.authId) {
              deliverManData.name = auth.authName;
              deliverManData.image = auth.authImgUrl;
              deliverManData.delivered = man.deliveries;
          }
      });

      let totalReviews = 0;
      let ratingCount = 0;

      reviewsData.forEach((review) => {
          if (review.deliverManId === man.id) {
              totalReviews = review.reviews.length;
              review.reviews.forEach((r) => {
                  ratingCount += r.rating;
              });
              deliverManData.rating = totalReviews > 0 ? ratingCount / totalReviews : 0;
          }
      });

      listTopThree.push(deliverManData); 
  });

  
  return listTopThree
};

const statisticsForBarChartFromDB = async () => {
    const result = await ParcelModel.aggregate([
      {
        $group: {
          _id: "$bookingDate", 
          total: { $sum: 1 }, 
        },
      },
      {
        $sort: { _id: 1 }, 
      },
    ]);
  
 
    const bookingDate = result.map((item) => {
      const date = new Date(item._id); 
      return date.toISOString().split('T')[0]; 
    });
  
    const booked = result.map((item) => item.total);
  
    return { bookingDate, booked };
  };
  

const statisticsForLineChartFromDB = async () => {
  const result = await ParcelModel.aggregate([
    {
      $group: {
        _id: "$bookingDate",
        totalBooked: { $sum: 1 },
        totalDelivered: {
          $sum: {
            $cond: [{ $eq: ["$bookingStatus", "Delivered"] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        bookingDate: "$_id",
        totalBooked: 1,
        totalDelivered: 1,
      },
    },
  ]);

  const bookingDates = result.map((item) => {
    const date = new Date(item.bookingDate);
    return date.toISOString().split('T')[0]; 
  });

  const booked = result.map((item) => item.totalBooked);
  const delivered = result.map((item) => item.totalDelivered);

  return { bookingDates, booked, delivered };
};
const statisticsAuthParcelFromDB = async (id: string) => {
  const parcelData = await ParcelModel.find();
  const authData = await AuthModel.findById(id);
  if(!authData) {
    throw new AppError(400, 'No auth data found')
  }


 if(authData.role === 'User'){
  let parcelCount = 0;
  let parcelCost = 0;
  parcelData.forEach(parcel => {
    if(parcel.email === authData.email){
      parcelCount ++;
      parcelCost = parcelCost + parcel.price;
    }
  })
  return {id: authData.authId, parcelCount, parcelCost}
 }else if(authData.role === 'DeliverMan'){

  const reviewData = await UserReviewModel.findOne({deliverManId: authData.authId})
 
    let deliveredCount = 0;
    parcelData.forEach(parcel => {
      if(parcel.deliveryMan === authData.authId){
        deliveredCount ++;
      }
    })
    
    let totalRating = 0;
    let avgReview = 0;
    if(reviewData){
      const totalReview = reviewData?.reviews.length;
      reviewData?.reviews.forEach(review => {
        totalRating = totalRating + review.rating;
      })
      avgReview = totalRating / totalReview;
    }
    
    return {id:authData.authId,deliveredCount, avgReview}
 }

 
};

  
  

  


export const StatisticsServices = {
    topDeliverThreeMenIntoDB,
    numberBookedDeliveredUsingAppIntoDB,
    statisticsForBarChartFromDB,
    statisticsForLineChartFromDB,
    statisticsAuthParcelFromDB
    

}