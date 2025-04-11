"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.verifyAuthToken = void 0;
// const jwt = require("jsonwebtoken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const index_1 = __importDefault(require("../Custom_message/index"));
const user_1 = __importDefault(require("../models/user"));
const session_1 = __importDefault(require("../models/session"));
const verifyAuthToken = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                error: index_1.default.noToken,
                message: index_1.default.noToken,
                code: http_status_codes_1.default.UNAUTHORIZED,
            });
        }
        const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
        const verified = jsonwebtoken_1.default.verify(accessToken, JWT_SECRET_TOKEN);
        if (verified.role == "admin") {
            // const findAdmin = await adminModal.findOne({ token: token });
            // if (findAdmin) {
            //   req.user = verified;
            //   next();
            //   return;
            // } else {
            //   return res.status(StatusCodes.UNAUTHORIZED).json({
            //     error: message.invalidToken,
            //     message: message.invalidToken,
            //     code: StatusCodes.UNAUTHORIZED,
            //   });
            // }
            req.user = verified;
            next();
            return;
        }
        const check = await user_1.default.findOne({ _id: verified.id, isDelete: false }, { isDelete: 1, isActive: 1 });
        if (check) {
            if (check?.isActive) {
                const checkSession = await session_1.default.findOne({
                    userId: verified.id,
                    accessToken: accessToken,
                    role: verified.role,
                    isDelete: false,
                });
                if (checkSession) {
                    req.user = verified;
                    next();
                    return;
                }
                else {
                    return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                        error: index_1.default.sessionExpired,
                        message: index_1.default.sessionExpired,
                        code: http_status_codes_1.default.UNAUTHORIZED,
                    });
                }
            }
            else {
                return res.status(http_status_codes_1.default.FORBIDDEN).json({
                    error: index_1.default.accountBlocked,
                    message: index_1.default.accountBlocked,
                    code: http_status_codes_1.default.FORBIDDEN, //403
                });
            }
        }
        else {
            return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                error: index_1.default.invalidToken,
                message: index_1.default.invalidToken,
                code: http_status_codes_1.default.UNAUTHORIZED, //401
            });
        }
    }
    catch (err) {
        if (err.message == "jwt expired") {
            return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                error: index_1.default.sessionExpired,
                message: index_1.default.sessionExpired,
                code: http_status_codes_1.default.UNAUTHORIZED,
            });
        }
        return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
            error: index_1.default.invalidToken,
            message: index_1.default.invalidToken,
            code: http_status_codes_1.default.UNAUTHORIZED,
        });
    }
};
exports.verifyAuthToken = verifyAuthToken;
const checkRole = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        }
        else {
            return res.status(http_status_codes_1.default.FORBIDDEN).json({
                error: index_1.default.unAuthRole,
                message: index_1.default.unAuthRole,
                code: http_status_codes_1.default.FORBIDDEN, //403
            });
        }
    };
};
exports.checkRole = checkRole;
