import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';

import catchAsync from '../utils/catchAsync';
import { TAuthRole } from '../Modules/Auth/Auth.interface';
import { verifyToken } from '../Modules/Auth/Auth.utils';
import { AuthModel } from '../Modules/Auth/Auth.model';


const auth = (...requiredRoles: TAuthRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const token = req.headers.Authorization;
    const token = req.headers['authorization'];
    

    // checking if the token is missing
    if (!token) {
      throw new AppError(401, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_access_secret as string);


    

    const { email, role, iat } = decoded;

    // // checking if the user is exist
    const user = await AuthModel.isAuthExistByEmail(email);

    if (!user) {
      throw new AppError(404, 'This user is not found !');
    }


    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        401,
        'You are not authorized  hi!',
      );
    }

    req.user = decoded as JwtPayload & { role: string };
    console.log('you are auth-->',email, role)
    next();
  });
};

export default auth;
