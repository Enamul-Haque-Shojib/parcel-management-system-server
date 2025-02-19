/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { AuthRole } from './Auth.constant';


export type TFeedBack = {
  feedbackUserPhoto: string;
  name:string;
  lifeStyle: string;
  feedBack: string;
}

export type TReview = {
  userName: string;
  userImgUrl: string;
  email: string;
  feedback: string;
  reviewDate: Date;
  rating: number;
};

export type TUserReview = {
  deliverManId: string;
  reviews: TReview[];
};

export type TAuth = {
  authId: string;
  authName?: string;
  authImgUrl?: string;
  email: string;
  authPhoneNumber?: string;
  role?: 'Admin' | 'DeliverMan' | 'User';
};

export interface AuthStaticModel extends Model<TAuth> {
  isAuthExistById(id: string): Promise<TAuth>;
  isAuthExistByEmail(email: string): Promise<TAuth>;
}

export type TAuthRole = keyof typeof AuthRole;
