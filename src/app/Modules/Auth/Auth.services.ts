import AppError from '../../errors/AppError';
import { AuthRole, authSearchableField } from './Auth.constant';
import { TAuth, TFeedBack, TUserReview } from './Auth.interface';
import { AuthModel, FeedBackModel, UserReviewModel } from './Auth.model';
import {
  generateAdminId,
  generateUserId,
  generateDeliverManId,
  createToken,
} from './Auth.utils';
import QueryBuilder from '../../builder/QueryBuilder';
import { ParcelModel } from '../Parcel/Parcel.model';

import config from '../../config';

const authAccountIntoDB = async (email: string, payload: TAuth) => {
  const auth = await AuthModel.isAuthExistByEmail(email);

  if (auth) {
    return auth;
  }

  if (payload.role === AuthRole.Admin) {
    payload.authId = await generateAdminId(payload.role);
  } else if (payload.role === AuthRole.DeliverMan) {
    payload.authId = await generateDeliverManId(payload.role);
  } else if (payload.role === AuthRole.User) {
    payload.authId = await generateUserId(payload.role);
  }

  const authData = await AuthModel.create(payload);
  return authData;
};
const updateAuthIntoDB = async (id: string, payload: Partial<TAuth>) => {
  const updateAuthInfo = await AuthModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!updateAuthInfo) {
    throw new AppError(400, 'Failed to update Auth');
  }
  return updateAuthInfo;
};
const getAllAuthsFromDB = async (query: Record<string, unknown>) => {
  const authQuery = new QueryBuilder(AuthModel.find(), query)
    .search(authSearchableField)
    .sortAndOrder()
    .paginate()
    .filter();
  const result = authQuery.modelQuery;

  return result;
};

const getAllDeliverMenFromDB = async () => {
  const deliverMenData = await AuthModel.find({ role: 'DeliverMan' });
  const parcelData = await ParcelModel.find();
  const reviewsData = await UserReviewModel.find();

  type TDeliverManInfo = {
    deliverMan_id?: string;
    name?: string;
    image?: string;
    phoneNumber?: string;
    delivered?: number;
    reviews?: number;
  };

  const listDeliverMenInfo: TDeliverManInfo[] = [];

  deliverMenData.forEach((man) => {
    const deliverManInfo: TDeliverManInfo = {};
    deliverManInfo.deliverMan_id = man.authId;
    deliverManInfo.name = man.authName;
    deliverManInfo.image = man.authImgUrl;
    deliverManInfo.phoneNumber = man.authPhoneNumber;

    let deliveredCount = 0;
    parcelData.forEach((parcel) => {
      if (
        man.authId === parcel.deliveryMan &&
        parcel.bookingStatus === 'Delivered'
      ) {
        deliveredCount++;
      }
    });
    deliverManInfo.delivered = deliveredCount;

    // Initialize reviews with 0 by default
    deliverManInfo.reviews = 0;

    reviewsData.forEach((review) => {
      if (review.deliverManId === man.authId) {
        // Match by authId
        const totalReviews = review.reviews.length;
        let ratingCount = 0;
        review.reviews.forEach((r) => {
          ratingCount += r.rating;
        });
        deliverManInfo.reviews =
          totalReviews > 0 ? ratingCount / totalReviews : 0;
      }
    });

    listDeliverMenInfo.push(deliverManInfo); // Push a new object into the array
  });

  console.log(listDeliverMenInfo);
};

const deleteAuthFromDB = async (id: string) => {
  const deleteAuthInfo = await AuthModel.findByIdAndDelete(id);
  return deleteAuthInfo;
};

const addUserReviewIntoDB = async (
  deliverManId: string,
  payload: TUserReview,
) => {
  const userReview = await UserReviewModel.findOneAndUpdate(
    { deliverManId },
    { $push: { reviews: payload } },
    { new: true, upsert: true },
  );

  if (!userReview) {
    throw new AppError(400, 'Could not added the review');
  }
  return userReview;
};

const getAllDeliverMenReviewsFromDB = async () => {
  const result = await UserReviewModel.find();
  return result;
};
const getSingleDeliverManReviewsFromDB = async (deliverManId: string) => {
  const reviewsData = await UserReviewModel.findOne(
    { deliverManId },
    { reviews: 1 },
  ).lean();

  if (!reviewsData || !reviewsData.reviews) {
    return [];
  }

  const result = reviewsData.reviews.sort((a, b) => {
    const dateA = a.rating;
    const dateB = b.rating;
    return dateB - dateA;
  });

  //   const result = reviewsData.reviews.sort((a, b) => {
  //     const dateA = new Date(a.reviewDate).getTime();
  //     const dateB = new Date(b.reviewDate).getTime();
  //     return dateB - dateA;
  //   });

  return result;
};


const feedBackUserIntoDB = async (userData: TFeedBack) => {
  
  const feedBack = await FeedBackModel.create(userData);
  

return feedBack;

};
const getAllFeedBackUserIntoDB = async () => {
  const feedBack = await FeedBackModel.find();
  
return feedBack;

};

const parcelIntoDB = async (id: string, payload: Record<string, unknown>) => {
  console.log(id, payload);
  const updatedParcel = await ParcelModel.findByIdAndUpdate(
    id,
    {
      $set: payload,
    },
    { new: true, runValidators: true },
  );

  if (!updatedParcel) {
    throw new AppError(400, 'Parcel could not be updated');
  }

  return updatedParcel;
};

const authRoleChangeIntoDB = async (
  id: string,
  payload: Record<string, unknown>,
) => {
  const authData = await AuthModel.isAuthExistById(id);

  if (!authData) {
    throw new AppError(400, 'User does not exist');
  }

  const updatedFields: Record<string, unknown> = { role: payload.role };

  if (payload.role === AuthRole.Admin) {
    updatedFields.authId = await generateAdminId(payload.role);
  } else if (payload.role === AuthRole.DeliverMan) {
    updatedFields.authId = await generateDeliverManId(payload.role);
  }

  const updatedUser = await AuthModel.findByIdAndUpdate(
    id,
    {
      $set: updatedFields,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    throw new AppError(400, 'User could not be updated');
  }

  return updatedUser;
};

const createJwtToken = async (payload: { email: string }) => {
  const { email } = payload;
  const auth = await AuthModel.isAuthExistByEmail(email);

  const jwtPayload = {
    authId: auth.authId,
    email: auth.email,
    role: auth.role || '',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    token: accessToken,
    role: auth.role,
    authId: auth.authId,
  };
};

export const AuthServices = {
  authAccountIntoDB,
  updateAuthIntoDB,
  getAllAuthsFromDB,
  deleteAuthFromDB,
  addUserReviewIntoDB,
  getAllDeliverMenFromDB,
  getAllDeliverMenReviewsFromDB,
  getSingleDeliverManReviewsFromDB,
  parcelIntoDB,
  authRoleChangeIntoDB,
  createJwtToken,
  feedBackUserIntoDB,
  getAllFeedBackUserIntoDB
};
