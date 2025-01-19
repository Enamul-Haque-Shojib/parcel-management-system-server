
import AppError from "../../errors/AppError";
import { AuthModel } from "./Auth.model";
import jwt, { JwtPayload } from 'jsonwebtoken';




export const createToken = (
  jwtPayload: {email: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  try{
    return jwt.verify(token, secret) as JwtPayload;
  }catch(err){
    throw new AppError(401, 'Unauthorized!');
  }


  // return jwt.verify(token, secret) as JwtPayload;
};






const findLastId = async (role: string) => {

  
    const lastAuth = await AuthModel.findOne({
        role,
    },
    {
      authId: 1,
      _id: 0
    }
  )
      .sort({ authId: -1 }) 
      .lean(); 
  
    // return lastUser?.userId;
    
    return lastAuth?.authId ? lastAuth.authId : undefined;
  };

  export const generateAdminId = async (role: string) => {

    let currentId = (0).toString();

    const lastAuthId = await findLastId(role);

    if (lastAuthId) {
      currentId = lastAuthId.substring(2);
   
    }
  
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');



    incrementId = `A-${incrementId}`;
    return incrementId;
  };

  export const generateDeliverManId = async (role: string) => {

    let currentId = (0).toString();

    const lastUserId = await findLastId(role);
  
    if (lastUserId) {
      currentId = lastUserId.substring(3);

    }
  
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  
    incrementId = `DM-${incrementId}`;

    return incrementId;
  };
  export const generateUserId = async (role: string) => {

    let currentId = (0).toString();

    const lastAuthId = await findLastId(role);
  
  
    if (lastAuthId) {
    
      currentId = lastAuthId.substring(2);
    }
  
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  
    incrementId = `U-${incrementId}`;
    return incrementId;
  };