// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import StatusCodes from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import messages from "@Custom_message/index";
import userModel from "@models/user";
import sessionModel from "@models/session";

const verifyAuthToken = async (req: any, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: messages.noToken,
        message: messages.noToken,
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    const JWT_SECRET_TOKEN: any = process.env.JWT_SECRET_TOKEN
    const verified: any = jwt.verify(accessToken, JWT_SECRET_TOKEN);
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
    const check = await userModel.findOne(
      { _id: verified.id, isDelete: false },
      { isDelete: 1, isActive: 1 }
    );
    if (check) {
      if (check?.isActive) {
        const checkSession = await sessionModel.findOne({
          userId: verified.id,
          accessToken: accessToken,
          role: verified.role,
          isDelete: false,
        });
        if (checkSession) {
          req.user = verified;
          next();
          return;
        } else {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            error: messages.sessionExpired,
            message: messages.sessionExpired,
            code: StatusCodes.UNAUTHORIZED,
          });
        }
      } else {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: messages.accountBlocked,
          message: messages.accountBlocked,
          code: StatusCodes.FORBIDDEN, //403
        });
      }
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: messages.invalidToken,
        message: messages.invalidToken,
        code: StatusCodes.UNAUTHORIZED, //401
      });
    }
  } catch (err: any) {
    if (err.message == "jwt expired") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: messages.sessionExpired,
        message: messages.sessionExpired,
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: messages.invalidToken,
      message: messages.invalidToken,
      code: StatusCodes.UNAUTHORIZED,
    });
  }
}

const checkRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (roles.includes(req.user.role)) {
      next();
    }
    else {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: messages.unAuthRole,
        message: messages.unAuthRole,
        code: StatusCodes.FORBIDDEN, //403
      });
    }
  };
};

export { verifyAuthToken, checkRole };
