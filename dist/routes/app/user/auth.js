"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../controllers/user/auth"));
const schemaValidator_1 = require("../../../utils/schemaValidator");
const auth_2 = require("../../../validators/user/auth");
const authValidator_1 = require("../../../utils/authValidator");
const route = (0, express_1.Router)();
const p = {
    addUser: '/signUp',
    verifyEmail: '/verifyEmail/:id',
    userLogin: '/signIn',
    socialLogin: '/socialLogin',
    userInfo: '/getUserInfo',
    verifyOtp: '/verifyOtp/:id',
    forgotPassword: '/forgotPassword',
    re_generateAccessToken: '/re_generateAccessToken',
    changePassword: '/changePassword',
    verifyLink: '/verifyLink',
    logout: '/logout'
};
route.post(p.addUser, (0, schemaValidator_1.schemaValidator)(auth_2.authSchema), auth_1.default.addUser);
route.get(p.verifyEmail, auth_1.default.verifyEmail);
route.post(p.userLogin, (0, schemaValidator_1.schemaValidator)(auth_2.loginSchema), auth_1.default.userLogin);
route.post(p.socialLogin, (0, schemaValidator_1.schemaValidator)(auth_2.socialLogin), auth_1.default.socialLogin);
route.get(p.userInfo, (0, schemaValidator_1.schemaValidator_forQueryReq)(auth_2.userInfoSchema), auth_1.default.userInfo);
route.get(p.verifyOtp, (0, schemaValidator_1.schemaValidator_forQueryReq)(auth_2.verifyOtpSchema), auth_1.default.verifyOpt);
route.put(p.forgotPassword, (0, schemaValidator_1.schemaValidator)(auth_2.forgotPasswordSchema), auth_1.default.forgotPassword);
route.get(p.re_generateAccessToken, auth_1.default.re_generateAccessToken);
route.get(p.verifyLink, auth_1.default.verifyLink);
route.put(p.changePassword, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user']), (0, schemaValidator_1.schemaValidator)(auth_2.changePasswordSchema), auth_1.default.changePassword);
route.get(p.verifyLink, auth_1.default.verifyLink);
route.get(p.logout, auth_1.default.logout);
exports.default = route;
