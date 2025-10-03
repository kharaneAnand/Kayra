import { NextFunction } from "express";
import { validateRegistrationData } from "../utiles/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { validationError } from "../../../../packages/error-handler";
import { checkOtpRestrictions } from "../utiles/auth.helper";
import { Request, Response } from "express";

// register a new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    const existingUser = await prisma.user.findUnique({ where: email });

    if (existingUser) {
        return next(new validationError("User already exists with this email !"));
    };

    await checkOtpRestrictions(email, next);


}