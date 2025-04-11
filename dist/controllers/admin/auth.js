"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../models/index");
const errors_1 = require("../../utils/errors");
const index_2 = __importDefault(require("../../Custom_message/index"));
const http_status_codes_1 = require("http-status-codes");
const argon2_1 = __importDefault(require("argon2"));
const jwt = require("jsonwebtoken");
function adminSignup(body, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await index_1.adminauthModal.findOne({ email: body?.email });
            if (check !== null) {
                reject(new errors_1.CustomError(index_2.default.alreadyExist, http_status_codes_1.StatusCodes.BAD_REQUEST));
            }
            else {
                const hashPass = await argon2_1.default.hash(body?.password);
                body.password = hashPass;
                const addDataResult = await index_1.adminauthModal.create(body);
                if (addDataResult !== null) {
                    resolve(addDataResult);
                }
            }
        }
        catch (err) {
            reject(err);
        }
    });
}
function adminLogin(body, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const findAdmin = await index_1.adminauthModal.findOne({ email: body?.email });
            if (findAdmin) {
                const verifyPassword = await argon2_1.default.verify(`${findAdmin.password}`, body?.password);
                if (verifyPassword) {
                    const access_token = jwt.sign({ id: findAdmin._id, role: "admin" }, process.env.JWT_SECRET_TOKEN, {
                        expiresIn: "30d"
                    });
                    const adminDetails = await index_1.adminauthModal.findOneAndUpdate({ email: body?.email }, { token: access_token }, { new: true })
                        .select({ password: 0, isActive: 0, isDelete: 0 });
                    resolve(adminDetails);
                }
                else {
                    reject(new errors_1.CustomError(index_2.default.wrongPassword, http_status_codes_1.StatusCodes.BAD_REQUEST));
                }
            }
            else {
                reject(new errors_1.CustomError(index_2.default.noAccountMatch, http_status_codes_1.StatusCodes.BAD_REQUEST));
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.default = {
    adminSignup,
    adminLogin
};
