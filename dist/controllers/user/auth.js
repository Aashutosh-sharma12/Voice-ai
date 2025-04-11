"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../Custom_message/index"));
const index_2 = require("../../models/index");
const errors_1 = require("../../utils/errors");
const helpers_1 = require("../../utils/helpers");
const argon2_1 = __importDefault(require("argon2"));
const http_status_codes_1 = require("http-status-codes");
const email_1 = require("../../utils/email");
const { CREATED, OK } = http_status_codes_1.StatusCodes;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addUser = async (req, res, next) => {
    try {
        const { password, confirmationLink } = req.body;
        const email_trim = req.body.email.trim();
        const email = email_trim.toLowerCase();
        const checkUser_email = await index_2.userModel.findOne({ email: email, isDelete: false }, { email: 1 });
        if (checkUser_email) {
            throw new errors_1.CustomError(index_1.default.accountAlreadyExist, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        else {
            const totalUsers = await index_2.userModel.countDocuments();
            const obj = {
                ...req.body,
                email: email,
                uniqueId: (0, helpers_1.identityGenerator)('user', totalUsers),
                password: await argon2_1.default.hash(password + "" + process.env.Password_Secret_Key)
            };
            const addUser = await index_2.userModel.create(obj);
            const res_obj = addUser.toObject();
            delete res_obj.password;
            const emailObj = {
                email: email,
                // confirmationLink: `${process.env.BaseUrl}/user/auth/verifyEmail/res_obj._id`
                confirmationLink: confirmationLink + "/" + res_obj._id
            };
            (0, email_1.send_welcomeEmail)(emailObj); // Welcome Email
            res.status(CREATED).json({ data: res_obj, code: CREATED, message: index_1.default.signupSuccessful });
        }
    }
    catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
};
const verifyEmail = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const checkDetails = await index_2.userModel.findOne({ _id: userId });
        if (checkDetails) {
            if (checkDetails?.isEmailVerified) {
                throw new errors_1.CustomError(index_1.default.alreadyEmailVerified, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            else {
                await index_2.userModel.updateOne({ _id: userId }, { isEmailVerified: true });
                res.status(OK).json({ code: OK, data: { success: true } });
            }
        }
        else {
            throw new errors_1.CustomError(index_1.default.invalidLink, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    catch (err) {
        next(err);
    }
};
const userLogin = async (req, res, next) => {
    try {
        const { devicetype, deviceip, devicetoken, language = 'en', timezone = 'Asia/Calcutta' } = req.headers;
        const { email, password } = req.body;
        const userDetails = await index_2.userModel.findOne({ email: email, isDelete: false });
        if (userDetails) {
            if (userDetails?.isActive) {
                if (userDetails?.social_loginStatus) {
                    throw new errors_1.CustomError(index_1.default.wrongPassword, http_status_codes_1.StatusCodes.NON_AUTHORITATIVE_INFORMATION);
                }
                if (userDetails.isEmailVerified === false) {
                    throw new errors_1.CustomError(index_1.default.isEmailVerified, http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                if (await argon2_1.default.verify(userDetails.password, password + "" + process.env.Password_Secret_Key)) {
                    const res_obj = userDetails.toObject();
                    const session_obj = {
                        userId: userDetails._id,
                        deviceType: devicetype,
                        deviceIp: deviceip,
                        deviceToken: devicetoken,
                        language: language,
                        timezone: timezone,
                        refreshToken: (0, helpers_1.generate_refreshToken)(userDetails._id, 'user'),
                        accessToken: (0, helpers_1.generate_accessToken)(userDetails._id, 'user')
                    };
                    await index_2.sessionModel.create(session_obj);
                    res_obj.accessToken = session_obj.accessToken;
                    res_obj.refreshToken = session_obj.refreshToken;
                    delete res_obj.password;
                    res.status(OK).json({ data: res_obj, code: OK, message: index_1.default.loginSuccessful });
                }
                else {
                    throw new errors_1.CustomError(index_1.default.wrongPassword, http_status_codes_1.StatusCodes.NON_AUTHORITATIVE_INFORMATION);
                }
            }
            else {
                throw new errors_1.CustomError(index_1.default.accountBlocked, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        }
        else {
            throw new errors_1.CustomError(index_1.default.userNotFound_withEmail, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
    }
    catch (err) {
        next(err);
    }
};
const socialLogin = async (req, res, next) => {
    try {
        const { devicetype, deviceip, devicetoken, language = 'en', timezone = 'Asia/Calcutta' } = req.headers;
        const { socialId, countryCode, phoneNumber } = req.body;
        const email_trim = req.body.email.trim();
        const email = email_trim.toLowerCase();
        const userDetails = await index_2.userModel.findOne({ "social_login_details.socialId": socialId, isDelete: false });
        if (userDetails) {
            if (userDetails?.isActive) {
                const res_obj = userDetails.toObject();
                const session_obj = {
                    userId: userDetails._id,
                    deviceType: devicetype,
                    deviceIp: deviceip,
                    deviceToken: devicetoken,
                    timezone: timezone,
                    language: language,
                    refreshToken: (0, helpers_1.generate_refreshToken)(userDetails._id, 'user'),
                    accessToken: (0, helpers_1.generate_accessToken)(userDetails._id, 'user')
                };
                await index_2.sessionModel.create(session_obj);
                res_obj.accessToken = session_obj.accessToken;
                res_obj.refreshToken = session_obj.refreshToken;
                delete res_obj.password;
                res.status(OK).json({ data: res_obj, code: OK, message: index_1.default.loginSuccessful });
            }
            else {
                throw new errors_1.CustomError(index_1.default.accountBlocked, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        }
        else {
            const userDetails_with_email = await index_2.userModel.findOne({ email: email, isDelete: false });
            if (userDetails_with_email) {
                if (userDetails_with_email?.isActive) {
                    const updated_res = await index_2.userModel.findOneAndUpdate({ _id: userDetails_with_email._id }, { social_login_details: { socialId: socialId, email: email }, social_loginStatus: true }, { new: true, fields: { password: 0, isEmailVerified: 0 } });
                    if (updated_res) {
                        const res_obj = updated_res.toObject();
                        const session_obj = {
                            userId: updated_res._id,
                            deviceType: devicetype,
                            deviceIp: deviceip,
                            deviceToken: devicetoken,
                            language: language,
                            timezone: timezone,
                            refreshToken: (0, helpers_1.generate_refreshToken)(updated_res._id, 'user'),
                            accessToken: (0, helpers_1.generate_accessToken)(updated_res._id, 'user')
                        };
                        await index_2.userModel.updateOne({ _id: updated_res._id, isEmailVerified: false }, { isEmailVerified: true });
                        await index_2.sessionModel.create(session_obj);
                        res_obj.accessToken = session_obj.accessToken;
                        res_obj.refreshToken = session_obj.refreshToken;
                        res.status(OK).json({ data: res_obj, code: OK, message: index_1.default.loginSuccessful });
                    }
                    else {
                        throw new errors_1.CustomError(index_1.default.userNotFound_withEmail, http_status_codes_1.StatusCodes.NOT_FOUND);
                    }
                }
                else {
                    throw new errors_1.CustomError(index_1.default.accountBlocked, http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            else {
                const totalUsers = await index_2.userModel.countDocuments();
                const obj = {
                    ...req.body,
                    email: email,
                    social_loginStatus: true,
                    social_login_details: {
                        socialId: socialId,
                        email: email
                    },
                    isEmailVerified: true,
                    uniqueId: (0, helpers_1.identityGenerator)('user', totalUsers),
                };
                const addUser = await index_2.userModel.create(obj);
                const res_obj = addUser.toObject();
                const session_obj = {
                    userId: addUser._id,
                    deviceType: devicetype,
                    deviceIp: deviceip,
                    deviceToken: devicetoken,
                    language: language,
                    timezone: timezone,
                    refreshToken: (0, helpers_1.generate_refreshToken)(addUser._id, 'user'),
                    accessToken: (0, helpers_1.generate_accessToken)(addUser._id, 'user')
                };
                await index_2.sessionModel.create(session_obj);
                res_obj.accessToken = session_obj.accessToken;
                res_obj.refreshToken = session_obj.refreshToken;
                delete res_obj.password;
                const emailObj = {
                    email: email
                };
                (0, email_1.send_welcomeEmail)(emailObj); // Welcome Email
                res.status(OK).json({ data: res_obj, code: OK, message: index_1.default.loginSuccessful });
            }
        }
    }
    catch (err) {
        next(err);
    }
};
const userInfo = async (req, res, next) => {
    try {
        const { email, forgotPasswordLink } = req.query;
        const userDetails = await index_2.userModel.findOne({ email: email, isDelete: false }, { email: 1, social_loginStatus: 1 });
        if (userDetails) {
            if (userDetails?.social_loginStatus) {
                throw new errors_1.CustomError(index_1.default.socialLoginAccountnot_changePassword, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
            const token = jsonwebtoken_1.default.sign({ id: userDetails._id, role: 'user' }, JWT_SECRET_TOKEN, {
                expiresIn: "1h",
            });
            // const protected_routeLink = `${process.env.TZ}/api/v1/user/auth/verifyLink?token=${token}`
            const emailObj = {
                otp: (0, helpers_1.generateOtp)(),
                email: email,
                link: forgotPasswordLink + "?token=" + token
            };
            await index_2.linkModel.create({ token: token, userId: userDetails._id });
            (0, email_1.send_forgotPasswordEmail)(emailObj); // Welcome Email
            res.status(OK).json({ data: userDetails, code: OK });
        }
        else {
            throw new errors_1.CustomError(index_1.default.userNotFound_withEmail, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
    }
    catch (err) {
        next(err);
    }
};
const verifyLink = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
        const verifyToken = jsonwebtoken_1.default.verify(authorization, JWT_SECRET_TOKEN);
        const checkLink_used = await index_2.linkModel.findOne({ token: authorization, userId: verifyToken.id, });
        if (checkLink_used) {
            if (checkLink_used?.isUsed) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: index_1.default.linkUsed,
                    message: index_1.default.linkUsed,
                    code: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            else {
                res.status(OK).json({ data: { success: true }, code: OK });
            }
        }
    }
    catch (err) {
        if (err.message == "jwt expired") {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                error: index_1.default.sessionExpired,
                message: index_1.default.sessionExpired,
                code: http_status_codes_1.StatusCodes.UNAUTHORIZED
            });
        }
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            error: index_1.default.invalidToken,
            message: index_1.default.invalidToken,
            code: http_status_codes_1.StatusCodes.UNAUTHORIZED
        });
    }
};
const verifyOpt = async (req, res, next) => {
    try {
        const { otp } = req.query;
        const userId = req.params.id;
        const checkUser_otp = await index_2.userModel.findOne({ _id: userId, otp: otp }, { email: 1 });
        if (checkUser_otp) {
            res.status(OK).json({ data: checkUser_otp, code: OK });
        }
        else {
            throw new errors_1.CustomError(index_1.default.invalidOtp, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    catch (err) {
        next(err);
    }
};
const forgotPassword = async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;
        const { authorization } = req.headers;
        const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
        const verifyToken = jsonwebtoken_1.default.verify(authorization, JWT_SECRET_TOKEN);
        const checkLink_used = await index_2.linkModel.findOne({ token: authorization, userId: verifyToken.id, });
        if (checkLink_used) {
            const userId = verifyToken.id;
            if (checkLink_used?.isUsed) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: index_1.default.linkUsed,
                    message: index_1.default.linkUsed,
                    code: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            else {
                const userDetails = await index_2.userModel.findById(userId, { email: 1 });
                if (userDetails) {
                    if (password === confirmPassword) {
                        const encrypted_password = await argon2_1.default.hash(password + "" + process.env.Password_Secret_Key);
                        await index_2.userModel.updateOne({ _id: userId }, { password: encrypted_password });
                        await index_2.linkModel.updateOne({ token: authorization, userId: verifyToken.id, }, { isUsed: true });
                        res.status(OK).json({ data: { success: true }, code: OK });
                    }
                    else {
                        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                            error: index_1.default.bothNewAndConfirmSame,
                            message: index_1.default.bothNewAndConfirmSame,
                            code: http_status_codes_1.StatusCodes.BAD_REQUEST
                        });
                    }
                }
                else {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        error: index_1.default.userNotFound_withEmail,
                        message: index_1.default.userNotFound_withEmail,
                        code: http_status_codes_1.StatusCodes.NOT_FOUND
                    });
                }
            }
        }
    }
    catch (err) {
        if (err.message == "jwt expired") {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                error: index_1.default.sessionExpired,
                message: index_1.default.sessionExpired,
                code: http_status_codes_1.StatusCodes.UNAUTHORIZED
            });
        }
        next(err);
    }
};
const changePassword = async (req, res, next) => {
    try {
        const { role, id } = req.user;
        const { new_password, confirmPassword, old_password } = req.body;
        const userDetails = await index_2.userModel.findById(id, { email: 1, password: 1, social_loginStatus: 1 });
        if (userDetails) {
            if (userDetails.social_loginStatus) {
                throw new errors_1.CustomError(index_1.default.wrongPassword, http_status_codes_1.StatusCodes.NON_AUTHORITATIVE_INFORMATION);
            }
            if (!await argon2_1.default.verify(userDetails.password, old_password + "" + process.env.Password_Secret_Key)) {
                throw new errors_1.CustomError(index_1.default.wrongPassword, http_status_codes_1.StatusCodes.NON_AUTHORITATIVE_INFORMATION);
            }
            if (new_password === confirmPassword) {
                const encrypted_password = await argon2_1.default.hash(new_password + "" + process.env.Password_Secret_Key);
                await index_2.userModel.updateOne({ _id: id }, { password: encrypted_password });
                res.status(OK).json({ data: { success: true }, code: OK });
            }
            else {
                throw new errors_1.CustomError(index_1.default.bothNewAndConfirmSame, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        }
        else {
            throw new errors_1.CustomError(index_1.default.userNotFound_withEmail, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
    }
    catch (err) {
        next(err);
    }
};
const logout = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const user_sessionDetails = await index_2.sessionModel.findOne({ accessToken: authorization }, { refreshToken: 1, accessToken: 1 });
        if (user_sessionDetails) {
            await index_2.sessionModel.deleteMany({ refreshToken: user_sessionDetails.refreshToken });
            res.status(OK).json({ code: OK, message: index_1.default.logoutSuccessful });
        }
        else {
            throw new errors_1.CustomError(index_1.default.invalidToken, http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
    }
    catch (err) {
        next(err);
    }
};
const re_generateAccessToken = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
        const verified = jsonwebtoken_1.default.verify(authorization, JWT_SECRET_TOKEN);
        const check = await index_2.userModel.findOne({ _id: verified.id, isDelete: false }, { isDelete: 1, isActive: 1 });
        if (check) {
            if (check?.isActive) {
                const checkSession = await index_2.sessionModel.findOne({
                    userId: verified.id,
                    refreshToken: authorization,
                    role: verified.role,
                    isDelete: false,
                });
                if (checkSession) {
                    const newAccessToken = await (0, helpers_1.generate_accessToken)(verified.id, verified.role);
                    const update = await index_2.sessionModel.updateOne({
                        userId: verified.id,
                        refreshToken: authorization,
                        role: verified.role,
                        isDelete: false,
                    }, {
                        accessToken: newAccessToken
                    });
                    if (update && update.modifiedCount == 1) {
                        res.status(http_status_codes_1.StatusCodes.OK).send({
                            accessToken: newAccessToken,
                            message: index_1.default.regeneratedGenerated,
                            code: http_status_codes_1.StatusCodes.OK
                        });
                    }
                    else {
                        return res.status(410).json({
                            error: index_1.default.invalidToken,
                            message: index_1.default.invalidToken,
                            code: 410
                        });
                    }
                }
                else {
                    return res.status(410).json({
                        error: index_1.default.invalidToken,
                        message: index_1.default.invalidToken,
                        code: 410
                    });
                }
            }
            else {
                return res.status(410).json({
                    error: index_1.default.accountBlocked,
                    message: index_1.default.accountBlocked,
                    code: 410,
                });
            }
        }
        else {
            return res.status(410).json({
                error: index_1.default.invalidToken,
                message: index_1.default.invalidToken,
                code: 410,
            });
        }
    }
    catch (err) {
        if (err.message == "jwt expired") {
            return res.status(410).json({
                error: index_1.default.sessionExpired,
                message: index_1.default.sessionExpired,
                code: 410
            });
        }
        return res.status(410).json({
            error: index_1.default.invalidToken,
            message: index_1.default.invalidToken,
            code: 410
        });
    }
};
exports.default = {
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
};
