
import AppError from "../../errors/AppError";
import { AuthRole, authSearchableField } from "./Auth.constant";
import { TAuth, TUserReview } from "./Auth.interface";
import { AuthModel, UserReviewModel } from "./Auth.model";
import { generateAdminId, generateUserId, generateDeliverManId, createToken, verifyToken } from "./Auth.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { ParcelModel } from "../Parcel/Parcel.model";

import config from "../../config";

const authAccountIntoDB = async (email: string, payload: TAuth) => {

  const auth = await AuthModel.isAuthExistByEmail(email);

  if(auth) {
    return auth;
  }

    if(payload.role === AuthRole.Admin){
        payload.authId = await generateAdminId(payload.role);
    }else if(payload.role === AuthRole.DeliverMan){
        payload.authId = await generateDeliverManId(payload.role);
    }else if(payload.role === AuthRole.User){
        payload.authId = await generateUserId(payload.role);
    }

    const authData = await AuthModel.create(payload);
    return authData; 
}
const updateAuthIntoDB = async (id: string, payload:Partial<TAuth>) => {
    const updateAuthInfo = await AuthModel.findByIdAndUpdate(id, payload,
        {
            new: true
        }
    );
    if(!updateAuthInfo){
        throw new AppError(400, 'Failed to update Auth')
    }
    return updateAuthInfo;
}
const getAllAuthsFromDB = async (query: Record<string, unknown>)=>{
    const authQuery = new QueryBuilder(
        AuthModel.find(),
        query
    )
    .search(authSearchableField)
    .sortAndOrder()
    .paginate()
    .filter();
    const result = authQuery.modelQuery;

    return result;
}

const deleteAuthFromDB = async(id: string)=>{
    const deleteAuthInfo = await AuthModel.findByIdAndDelete(id);
    return deleteAuthInfo;
}

const addUserReviewIntoDB = async(deliverManId: string, payload: TUserReview)=>{
    const userReview = await UserReviewModel.findOneAndUpdate(
        { deliverManId },
        { $push: { reviews: payload } }, 
        { new: true, upsert: true } 
      );
      
      if (!userReview) {
        throw new AppError(400, 'Could not added the review')
      }
      return userReview;
}

const getAllReviewsFromDB = async(deliverManId: string) => {
    
    const reviewsData = await UserReviewModel.findOne(
        { deliverManId },
        { reviews: 1 }
      ).lean();
  
      if (!reviewsData || !reviewsData.reviews) {
        return [];
      }
  
     
      const result = reviewsData.reviews.sort((a, b) => {
        const dateA = a.rating
        const dateB = b.rating
        return dateB - dateA;
      });

    //   const result = reviewsData.reviews.sort((a, b) => {
    //     const dateA = new Date(a.reviewDate).getTime();
    //     const dateB = new Date(b.reviewDate).getTime();
    //     return dateB - dateA;
    //   });
  
      return result;

}

const parcelIntoDB = async(id: string, payload: Record<string, unknown>) => {
    const updatedParcel = await ParcelModel.findByIdAndUpdate(
        id,
        {
          $set: payload, 
        },
        { new: true, runValidators: true } 
      );
    
      if (!updatedParcel) {
        throw new AppError(400, 'Parcel could not be updated');
      }
    
      return updatedParcel;

}

const authRoleChangeIntoDB = async(id: string, payload: Record<string, unknown>) => {

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
      }
    );
  
    if (!updatedUser) {
      throw new AppError(400, 'User could not be updated');
    }
  
    return updatedUser;

}

const createJwtToken = async (payload: {email:string}) => {

const {email} = payload;
  const auth = await AuthModel.isAuthExistByEmail(email)

  const jwtPayload = {
   
    email: auth.email,
    role: auth.role || "",
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    token:accessToken,
    role: auth.role
  };
};

export const AuthServices = {
    authAccountIntoDB,
    updateAuthIntoDB,
    getAllAuthsFromDB,
    deleteAuthFromDB,
    addUserReviewIntoDB,
    getAllReviewsFromDB,
    parcelIntoDB,
    authRoleChangeIntoDB,
    createJwtToken
}