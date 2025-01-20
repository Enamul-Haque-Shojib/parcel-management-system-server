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

  console.log(numberBooked, numberDelivered,numberUsingApp)

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

  // Sort the flatList in descending order by the number of deliveries
  flatList.sort((a, b) => b.deliveries - a.deliveries);

  // Get the top 3
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
      const deliverManData: DeliverManData = {}; // Create a new object for each deliver man

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

      listTopThree.push(deliverManData); // Push the new object into the list
  });

  
  return listTopThree
};

const statisticsForBarChartFromDB = async () => {
    const result = await ParcelModel.aggregate([
      {
        $group: {
          _id: "$bookingDate", // Group by bookingDate
          total: { $sum: 1 }, // Count the number of parcels for each bookingDate
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
    return date.toISOString().split('T')[0]; // Convert Date object to 'YYYY-MM-DD'
  });

  const booked = result.map((item) => item.totalBooked);
  const delivered = result.map((item) => item.totalDelivered);

  return { bookingDates, booked, delivered };
};

  
  

  


export const StatisticsServices = {
    topDeliverThreeMenIntoDB,
    numberBookedDeliveredUsingAppIntoDB,
    statisticsForBarChartFromDB,
    statisticsForLineChartFromDB,
    

}