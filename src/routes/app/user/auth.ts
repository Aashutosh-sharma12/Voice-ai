import { Router } from "express";
import authController from '@controllers/user/auth';
import { schemaValidator, schemaValidator_forQueryReq } from "@utils/schemaValidator";
import { authSchema, forgotPasswordSchema, loginSchema, userInfoSchema, verifyOtpSchema, socialLogin, changePasswordSchema } from "@validators/user/auth";
import { checkRole, verifyAuthToken } from "@utils/authValidator";

const route = Router();
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

route.post(p.addUser, schemaValidator(authSchema), authController.addUser);
route.get(p.verifyEmail, authController.verifyEmail);
route.post(p.userLogin, schemaValidator(loginSchema), authController.userLogin);
route.post(p.socialLogin, schemaValidator(socialLogin), authController.socialLogin);
route.get(p.userInfo, schemaValidator_forQueryReq(userInfoSchema), authController.userInfo);
route.get(p.verifyOtp, schemaValidator_forQueryReq(verifyOtpSchema), authController.verifyOpt);
route.put(p.forgotPassword, schemaValidator(forgotPasswordSchema), authController.forgotPassword);
route.get(p.re_generateAccessToken, authController.re_generateAccessToken);
route.get(p.verifyLink, authController.verifyLink);
route.put(p.changePassword, verifyAuthToken, checkRole(['user']), schemaValidator(changePasswordSchema), authController.changePassword);
route.get(p.verifyLink, authController.verifyLink);
route.get(p.logout, authController.logout);

export default route;