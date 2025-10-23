import crypto from 'crypto';
import { ValidationError } from '../../../../packages/error-handler';
import redis from '../../../../packages/libs/redis';
import { sendEmail } from '../utils/sendMail/index';
import { NextFunction } from 'express';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistraionData = (data: any, userType: "user" | "seller") => {

    const { name, email, password, phone_Number, country } = data;


    if (!name || !email || !password || (userType === "seller" && (!phone_Number || !country))) {
        throw new ValidationError(`Missing required fields for ${userType} registration`);
    }

    if (!emailRegex.test(email)) {
        throw new ValidationError(`Invalid email format`);
    }
}


export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    if (await redis.get(`otp_lock:${email}`)) {
        return next(new ValidationError('Account locked due to multiple failed  attempts. Please try again after 30 min ! '));
    }
    if (await redis.get(`otp_spam_lock:${email}`)) {
        return next(new ValidationError('Too many OTP requests. Please wait 1 hour before requesting again.'));
    }
    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(new ValidationError('Please wait for the 1 minute before requesting another OTP ! '));
    }
}


export const trackOtpRequests = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_requests_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

    if (otpRequests >= 3) {
        // locked for 1 hour if more than 3 requests are made 
        await redis.set(`otp_spam_lock:${email}`, 'true', 'EX', 3600); // 1 hour lock
        return next(new ValidationError('Too many OTP requests. Please wait 1 hour before requesting again.'));
    }

    await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600); // reset count after 1 hour
}

export const sendOtp = async (name: string, email: string, template: string) => {

    const otp = crypto.randomInt(1000, 9999).toString();
    await sendEmail(email, "Verify  Your Email", template, { name, otp });


    // set this otp in the redis database with the expiry of 5 minutes ;
    await redis.set(`otp:${email}`, otp, 'EX', 300);
    await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // 1 minute cooldown


}

