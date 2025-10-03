import crypto from "crypto";
import { validationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/libs/radis";
import { sendEmail } from "../utiles/sendMail";
import { NextFunction } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const { name, email, password, phone_number, country } = data;

    if (
        !name || !email || !password || (userType === "seller" && (!phone_number || !country))
    ) {
        throw new validationError("Missing required fields !");
    }


    if (!emailRegex.test(email)) {
        throw new validationError("Invalid email format !");
    }
}


export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    if (await redis.get(`otp_lock:${email}`)) {
        return next(new validationError("Account locked due to multiple failed OTP attempts. Please try again after 30 minutes ."));
    }

    if (await redis.get(`otp_spam_lock:${email}`)) {
        return next(new validationError("Too many OTP requests. Please wait 1 hr before requesting again."));
    }

    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(new validationError("Please wait 1 Min  before requesting new  OTP."));
    }


}


export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString();

    await sendEmail(email, "Verify your email", template, { name, otp });
    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
    console.log(`Sending OTP ${otp} to email ${email} using template ${template}`);

}
