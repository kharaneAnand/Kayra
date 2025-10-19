import { Request, Response, NextFunction } from 'express';
import { validateRegistraionData } from '../utils/auth_helper';
import prisma from '../../../../packages/libs/prisma';
import { ValidationError } from '../../../../packages/error-handler';
import { checkOtpRestrictions as checkOtpRestriction } from '../utils/auth_helper';
import { trackOtpRequests } from '../utils/auth_helper';
import { sendOtp } from '../utils/auth_helper';

// Register a new user 
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistraionData(req.body, "user");
        const { name, email } = req.body;



        // checking for the user whether the user is available or not with the same email
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return next(new ValidationError('User with this email already exists !'));
        };

        await checkOtpRestriction(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, 'user-activation-mail');


        res.status(200).json({
            message: 'OTP sent to your email . please verify your account .',
        });
    } catch (error) {
        return next(error);
    }
};