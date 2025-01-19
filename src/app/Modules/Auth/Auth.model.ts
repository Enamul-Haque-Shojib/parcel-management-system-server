import { model, Schema } from "mongoose";
import { TReview, TAuth, TUserReview, AuthStaticModel } from "./Auth.interface";




const reviewSchema = new Schema<TReview>({
    
    userName: {
        type: String,
        required: true,
    },
    userImgUrl: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
    reviewDate: {
        type: Date,
        default: Date.now(),
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    }

})

const userReviewSchema = new Schema<TUserReview>({
    deliverManId: {
        type: String,
        required: true,
    },

    reviews: [reviewSchema]

})


const authSchema = new Schema<TAuth, AuthStaticModel>({
    authId: { type: String, required: true, unique: true },
    authName:{
        type: String,
        default: ""
        
    },
    authImgUrl:{
        type: String,
        default: ""
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    authPhoneNumber:{
        type: String,
        unique: true,
        default: ""
        
    },
    role:{
        type: String,
        enum: {
            values: ["Admin", "DeliverMan", "User"]
        },
        default: ""
    }
},
{
    timestamps: true,
}
);


authSchema.statics.isAuthExistById = async function (id: string) {
    return await AuthModel.findById(id, {authId: 1});
  };
authSchema.statics.isAuthExistByEmail = async function (email: string) {
    return await AuthModel.findOne({email});
  };

export const AuthModel = model<TAuth, AuthStaticModel>('Auth', authSchema);
export const UserReviewModel = model<TUserReview>('User Review', userReviewSchema);
