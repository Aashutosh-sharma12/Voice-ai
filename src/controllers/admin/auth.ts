import { adminauthModal } from "@models/index";
import { CustomError } from "@utils/errors";
import messages from "@Custom_message/index";
import { StatusCodes } from "http-status-codes";
import argon2 from "argon2";
const jwt = require("jsonwebtoken");



function adminSignup(body: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await adminauthModal.findOne({ email: body?.email });
      if (check !== null) {
        reject(new CustomError(messages.alreadyExist, StatusCodes.BAD_REQUEST));
      } else {
        const hashPass = await argon2.hash(body?.password);
        body.password = hashPass;
        const addDataResult = await adminauthModal.create(body);
        if (addDataResult !== null) {
          resolve(addDataResult);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
}

function adminLogin(body: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const findAdmin = await adminauthModal.findOne({ email: body?.email });
      if (findAdmin) {
        const verifyPassword = await argon2.verify(`${findAdmin.password}`, body?.password);
        if (verifyPassword) {
          const access_token = jwt.sign(
            { id: findAdmin._id, role: "admin" },
            process.env.JWT_SECRET_TOKEN,
            {
              expiresIn: "30d"
            }
          );
          const adminDetails = await adminauthModal.findOneAndUpdate(
            { email: body?.email },
            { token: access_token },
            { new: true }
          )
            .select({ password: 0, isActive: 0, isDelete: 0 })
          resolve(adminDetails)
        } else {
          reject(new CustomError(messages.wrongPassword, StatusCodes.BAD_REQUEST))
        }
      } else {
        reject(
          new CustomError(messages.noAccountMatch, StatusCodes.BAD_REQUEST)
        );
      }
    } catch (error) {
      reject(error)
    }
  })
}

export default {
  adminSignup,
  adminLogin
} as const