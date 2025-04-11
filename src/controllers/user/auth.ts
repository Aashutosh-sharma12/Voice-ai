import { Request, Response, NextFunction } from 'express';
import messages from "@Custom_message/index";
import { userModel, sessionModel, linkModel } from "@models/index";
import { CustomError } from "@utils/errors";
import { generate_accessToken, generate_refreshToken, generateOtp, identityGenerator } from "@utils/helpers";
import argon2 from "argon2";
import { StatusCodes } from "http-status-codes";
import { send_forgotPasswordEmail, send_welcomeEmail } from '@utils/email';
const { CREATED, OK } = StatusCodes;
import jwt from 'jsonwebtoken';

const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, confirmationLink } = req.body;
        const email_trim = req.body.email.trim()
        const email = email_trim.toLowerCase()
        const checkUser_email = await userModel.findOne({ email: email, isDelete: false }, { email: 1 });
        if (checkUser_email) {
            throw new CustomError(messages.accountAlreadyExist, StatusCodes.BAD_REQUEST);
        } else {
            const totalUsers = await userModel.countDocuments();
            const obj = {
                ...req.body,
                email: email,
                uniqueId: identityGenerator('user', totalUsers),
                password: await argon2.hash(password + "" + process.env.Password_Secret_Key)
            }
            const addUser = await userModel.create(obj);
            const res_obj: any = addUser.toObject();
            delete res_obj.password;
            const emailObj = {
                email: email,
                // confirmationLink: `${process.env.BaseUrl}/user/auth/verifyEmail/res_obj._id`
                confirmationLink: confirmationLink + "/" + res_obj._id
            }
            send_welcomeEmail(emailObj); // Welcome Email
            res.status(CREATED).json({ data: res_obj, code: CREATED, message: messages.signupSuccessful });
        }
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
};

const verifyEmail = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id
        const checkDetails = await userModel.findOne({ _id: userId });
        if (checkDetails) {
            if (checkDetails?.isEmailVerified) {
                throw new CustomError(messages.alreadyEmailVerified, StatusCodes.BAD_REQUEST);
            } else {
                await userModel.updateOne({ _id: userId }, { isEmailVerified: true });
                res.status(OK).json({ code: OK, data: { success: true } });
            }
        } else {
            throw new CustomError(messages.invalidLink, StatusCodes.BAD_REQUEST);
        }
    } catch (err) {
        next(err)
    }
}

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { devicetype, deviceip, devicetoken, language = 'en', timezone = 'Asia/Calcutta' } = req.headers;
        const { email, password } = req.body;
        const userDetails = await userModel.findOne({ email: email, isDelete: false });
        if (userDetails) {
            if (userDetails?.isActive) {
                if (userDetails?.social_loginStatus) {
                    throw new CustomError(messages.wrongPassword, StatusCodes.NON_AUTHORITATIVE_INFORMATION);
                }
                if (userDetails.isEmailVerified === false) {
                    throw new CustomError(messages.isEmailVerified, StatusCodes.BAD_REQUEST);
                }
                if (await argon2.verify(userDetails.password, password + "" + process.env.Password_Secret_Key)) {
                    const res_obj: any = userDetails.toObject();
                    const session_obj = {
                        userId: userDetails._id,
                        deviceType: devicetype,
                        deviceIp: deviceip,
                        deviceToken: devicetoken,
                        language: language,
                        timezone: timezone,
                        refreshToken: generate_refreshToken(userDetails._id, 'user'),
                        accessToken: generate_accessToken(userDetails._id, 'user')
                    }
                    await sessionModel.create(session_obj);
                    res_obj.accessToken = session_obj.accessToken
                    res_obj.refreshToken = session_obj.refreshToken
                    delete res_obj.password;
                    res.status(OK).json({ data: res_obj, code: OK, message: messages.loginSuccessful });
                } else {
                    throw new CustomError(messages.wrongPassword, StatusCodes.NON_AUTHORITATIVE_INFORMATION);
                }
            } else {
                throw new CustomError(messages.accountBlocked, StatusCodes.BAD_REQUEST);
            }
        } else {
            throw new CustomError(messages.userNotFound_withEmail, StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        next(err);
    }
}

const socialLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { devicetype, deviceip, devicetoken, language = 'en', timezone = 'Asia/Calcutta' } = req.headers;
        const { socialId, countryCode, phoneNumber } = req.body;
        const email_trim = req.body.email.trim();
        const email = email_trim.toLowerCase();
        const userDetails = await userModel.findOne({ "social_login_details.socialId": socialId, isDelete: false });
        if (userDetails) {
            if (userDetails?.isActive) {
                const res_obj: any = userDetails.toObject();
                const session_obj = {
                    userId: userDetails._id,
                    deviceType: devicetype,
                    deviceIp: deviceip,
                    deviceToken: devicetoken,
                    timezone: timezone,
                    language: language,
                    refreshToken: generate_refreshToken(userDetails._id, 'user'),
                    accessToken: generate_accessToken(userDetails._id, 'user')
                }
                await sessionModel.create(session_obj);
                res_obj.accessToken = session_obj.accessToken
                res_obj.refreshToken = session_obj.refreshToken
                delete res_obj.password;
                res.status(OK).json({ data: res_obj, code: OK, message: messages.loginSuccessful });

            } else {
                throw new CustomError(messages.accountBlocked, StatusCodes.BAD_REQUEST);
            }
        } else {
            const userDetails_with_email = await userModel.findOne({ email: email, isDelete: false });
            if (userDetails_with_email) {
                if (userDetails_with_email?.isActive) {
                    const updated_res = await userModel.findOneAndUpdate({ _id: userDetails_with_email._id }, { social_login_details: { socialId: socialId, email: email }, social_loginStatus: true }, { new: true, fields: { password: 0, isEmailVerified: 0 } })
                    if (updated_res) {
                        const res_obj: any = updated_res.toObject();
                        const session_obj = {
                            userId: updated_res._id,
                            deviceType: devicetype,
                            deviceIp: deviceip,
                            deviceToken: devicetoken,
                            language: language,
                            timezone: timezone,
                            refreshToken: generate_refreshToken(updated_res._id, 'user'),
                            accessToken: generate_accessToken(updated_res._id, 'user')
                        }
                        await userModel.updateOne({ _id: updated_res._id, isEmailVerified: false }, { isEmailVerified: true });
                        await sessionModel.create(session_obj);
                        res_obj.accessToken = session_obj.accessToken
                        res_obj.refreshToken = session_obj.refreshToken
                        res.status(OK).json({ data: res_obj, code: OK, message: messages.loginSuccessful });
                    } else {
                        throw new CustomError(messages.userNotFound_withEmail, StatusCodes.NOT_FOUND);
                    }
                } else {
                    throw new CustomError(messages.accountBlocked, StatusCodes.BAD_REQUEST);
                }
            } else {
                const totalUsers = await userModel.countDocuments();
                const obj = {
                    ...req.body,
                    email: email,
                    social_loginStatus: true,
                    social_login_details: {
                        socialId: socialId,
                        email: email
                    },
                    isEmailVerified: true,
                    uniqueId: identityGenerator('user', totalUsers),
                }
                const addUser = await userModel.create(obj);
                const res_obj: any = addUser.toObject();
                const session_obj = {
                    userId: addUser._id,
                    deviceType: devicetype,
                    deviceIp: deviceip,
                    deviceToken: devicetoken,
                    language: language,
                    timezone: timezone,
                    refreshToken: generate_refreshToken(addUser._id, 'user'),
                    accessToken: generate_accessToken(addUser._id, 'user')
                }
                await sessionModel.create(session_obj);
                res_obj.accessToken = session_obj.accessToken;
                res_obj.refreshToken = session_obj.refreshToken;
                delete res_obj.password;
                const emailObj = {
                    email: email
                }
                send_welcomeEmail(emailObj); // Welcome Email
                res.status(OK).json({ data: res_obj, code: OK, message: messages.loginSuccessful });
            }
        }
    } catch (err) {
        next(err);
    }
}

const userInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, forgotPasswordLink } = req.query;
        const userDetails = await userModel.findOne({ email: email, isDelete: false }, { email: 1, social_loginStatus: 1 });
        if (userDetails) {
            if (userDetails?.social_loginStatus) {
                throw new CustomError(messages.socialLoginAccountnot_changePassword, StatusCodes.BAD_REQUEST);
            }
            const JWT_SECRET_TOKEN: any = process.env.JWT_SECRET_TOKEN
            const token = jwt.sign({ id: userDetails._id, role: 'user' }, JWT_SECRET_TOKEN, {
                expiresIn: "1h",
            }
            );
            // const protected_routeLink = `${process.env.TZ}/api/v1/user/auth/verifyLink?token=${token}`
            const emailObj = {
                otp: generateOtp(),
                email: email,
                link: forgotPasswordLink + "?token=" + token
            }
            await linkModel.create({ token: token, userId: userDetails._id });
            send_forgotPasswordEmail(emailObj); // Welcome Email
            res.status(OK).json({ data: userDetails, code: OK });
        } else {
            throw new CustomError(messages.userNotFound_withEmail, StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        next(err);
    }
}

const verifyLink = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        const JWT_SECRET_TOKEN: any = process.env.JWT_SECRET_TOKEN
        const verifyToken: any = jwt.verify(authorization, JWT_SECRET_TOKEN);
        const checkLink_used = await linkModel.findOne({ token: authorization, userId: verifyToken.id, });
        if (checkLink_used) {
            if (checkLink_used?.isUsed) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: messages.linkUsed,
                    message: messages.linkUsed,
                    code: StatusCodes.BAD_REQUEST
                });
            } else {
                res.status(OK).json({ data: { success: true }, code: OK });
            }
        }
    } catch (err: any) {
        if (err.message == "jwt expired") {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: messages.sessionExpired,
                message: messages.sessionExpired,
                code: StatusCodes.UNAUTHORIZED
            });
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: messages.invalidToken,
            message: messages.invalidToken,
            code: StatusCodes.UNAUTHORIZED
        });
    }
}

const verifyOpt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.query;
        const userId = req.params.id
        const checkUser_otp = await userModel.findOne({ _id: userId, otp: otp }, { email: 1 });
        if (checkUser_otp) {
            res.status(OK).json({ data: checkUser_otp, code: OK });
        } else {
            throw new CustomError(messages.invalidOtp, StatusCodes.BAD_REQUEST);
        }
    } catch (err) {
        next(err);
    }
}


const forgotPassword = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { password, confirmPassword } = req.body;
        const { authorization } = req.headers;
        const JWT_SECRET_TOKEN: any = process.env.JWT_SECRET_TOKEN
        const verifyToken: any = jwt.verify(authorization, JWT_SECRET_TOKEN);
        const checkLink_used = await linkModel.findOne({ token: authorization, userId: verifyToken.id, });
        if (checkLink_used) {
            const userId = verifyToken.id
            if (checkLink_used?.isUsed) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: messages.linkUsed,
                    message: messages.linkUsed,
                    code: StatusCodes.BAD_REQUEST
                });
            } else {
                const userDetails = await userModel.findById(userId, { email: 1 });
                if (userDetails) {
                    if (password === confirmPassword) {
                        const encrypted_password = await argon2.hash(password + "" + process.env.Password_Secret_Key);
                        await userModel.updateOne({ _id: userId }, { password: encrypted_password });
                        await linkModel.updateOne({ token: authorization, userId: verifyToken.id, }, { isUsed: true });
                        res.status(OK).json({ data: { success: true }, code: OK });
                    } else {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            error: messages.bothNewAndConfirmSame,
                            message: messages.bothNewAndConfirmSame,
                            code: StatusCodes.BAD_REQUEST
                        });
                    }
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        error: messages.userNotFound_withEmail,
                        message: messages.userNotFound_withEmail,
                        code: StatusCodes.NOT_FOUND
                    });
                }
            }
        }
    } catch (err: any) {
        if (err.message == "jwt expired") {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: messages.sessionExpired,
                message: messages.sessionExpired,
                code: StatusCodes.UNAUTHORIZED
            });
        }
        next(err);
    }
}

const changePassword = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { role, id } = req.user;
        const { new_password, confirmPassword, old_password } = req.body;
        const userDetails = await userModel.findById(id, { email: 1, password: 1, social_loginStatus: 1 });
        if (userDetails) {
            if (userDetails.social_loginStatus) {
                throw new CustomError(messages.wrongPassword, StatusCodes.NON_AUTHORITATIVE_INFORMATION);
            }
            if (!await argon2.verify(userDetails.password, old_password + "" + process.env.Password_Secret_Key)) {
                throw new CustomError(messages.wrongPassword, StatusCodes.NON_AUTHORITATIVE_INFORMATION);
            }
            if (new_password === confirmPassword) {
                const encrypted_password = await argon2.hash(new_password + "" + process.env.Password_Secret_Key);
                await userModel.updateOne({ _id: id }, { password: encrypted_password });
                res.status(OK).json({ data: { success: true }, code: OK });
            } else {
                throw new CustomError(messages.bothNewAndConfirmSame, StatusCodes.BAD_REQUEST);
            }
        } else {
            throw new CustomError(messages.userNotFound_withEmail, StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        next(err);
    }
}

const logout = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        const user_sessionDetails = await sessionModel.findOne({ accessToken: authorization }, { refreshToken: 1, accessToken: 1 });
        if (user_sessionDetails) {
            await sessionModel.deleteMany({ refreshToken: user_sessionDetails.refreshToken });
            res.status(OK).json({ code: OK, message: messages.logoutSuccessful });
        } else {
            throw new CustomError(messages.invalidToken, StatusCodes.UNAUTHORIZED);
        }
    } catch (err) {
        next(err);
    }
}

const re_generateAccessToken = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        const JWT_SECRET_TOKEN: any = process.env.JWT_SECRET_TOKEN
        const verified: any = jwt.verify(authorization, JWT_SECRET_TOKEN);
        const check = await userModel.findOne(
            { _id: verified.id, isDelete: false },
            { isDelete: 1, isActive: 1 }
        );

        if (check) {
            if (check?.isActive) {
                const checkSession = await sessionModel.findOne({
                    userId: verified.id,
                    refreshToken: authorization,
                    role: verified.role,
                    isDelete: false,
                });
                if (checkSession) {
                    const newAccessToken = await generate_accessToken(
                        verified.id,
                        verified.role
                    );
                    const update = await sessionModel.updateOne({
                        userId: verified.id,
                        refreshToken: authorization,
                        role: verified.role,
                        isDelete: false,
                    }, {
                        accessToken: newAccessToken
                    });
                    if (update && update.modifiedCount == 1) {
                        res.status(StatusCodes.OK).send({
                            accessToken: newAccessToken,
                            message: messages.regeneratedGenerated,
                            code: StatusCodes.OK
                        });
                    } else {
                        return res.status(410).json({
                            error: messages.invalidToken,
                            message: messages.invalidToken,
                            code: 410
                        });
                    }
                } else {
                    return res.status(410).json({
                        error: messages.invalidToken,
                        message: messages.invalidToken,
                        code: 410
                    });
                }
            } else {
                return res.status(410).json({
                    error: messages.accountBlocked,
                    message: messages.accountBlocked,
                    code: 410,
                });
            }
        } else {
            return res.status(410).json({
                error: messages.invalidToken,
                message: messages.invalidToken,
                code: 410,
            });
        }
    } catch (err: any) {
        if (err.message == "jwt expired") {
            return res.status(410).json({
                error: messages.sessionExpired,
                message: messages.sessionExpired,
                code: 410
            });
        }
        return res.status(410).json({
            error: messages.invalidToken,
            message: messages.invalidToken,
            code: 410
        });
    }
}

export default {
    addUser,
    verifyEmail,
    userLogin,
    socialLogin,
    userInfo,
    verifyLink,
    verifyOpt,
    forgotPassword,
    changePassword,
    logout,
    re_generateAccessToken
} as const;