import messages from "@Custom_message/index";
import userModel from "@models/user";
import { CustomError } from "@utils/errors";
import { StatusCodes } from "http-status-codes";
import moment from "moment";

function listUser(query: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { search, isActive, fromDate, toDate } = query;
      const page = parseInt(query?.page) || 1;
      const perPage = parseInt(query?.perPage) || 10;
      const skip = (page - 1) * perPage;
      let obj: any = {
        isDelete: false,
      };
      if (search && search !== "" && search !== undefined) {
        obj = {
          ...obj,
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } }
          ],
        };
      }
      if (fromDate && toDate) {
        const fromDate1 = moment(fromDate).format('YYYY-MM-DD');
        const toDate1 = moment(toDate).format('YYYY-MM-DD');
        obj = {
          ...obj,
          createdAt: {
            $gte: fromDate1,
            $lte: toDate1
          },
        };
      }

      if (isActive === "Active") {
        obj = { ...obj, isActive: true }
      } else if (isActive === "InActive") {
        obj = { ...obj, isActive: false }
      } else if (isActive === "all") {
        obj = { ...obj }
      } else {
        obj = { ...obj }
      }
      const [UserData, Count] = await Promise.all([userModel.find(obj, { isDelete: false }).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage), userModel.countDocuments(obj)])
      resolve({ totalCount: Count, user_data: UserData });
    } catch (error) {
      reject(error);
    }
  });
}


function details(params: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = params;
      const findUserById = await userModel.findOne({
        _id: id,
        isDelete: false,
      }
      );
      if (findUserById) {
        resolve(findUserById);
      } else {
        reject(
          new CustomError(messages.noDatafoundWithID, StatusCodes.NOT_FOUND)
        );
      }
    } catch (error) {
      reject(error);
    }
  });
}


function updateStatus(body: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { isActive, id } = body;
      const updataeStatus = await userModel.findOneAndUpdate(
        { _id: id, isDelete: false },
        { isActive: isActive },
        { new: true }
      );
      if (updataeStatus) {
        resolve({ success: true });
      } else {
        reject(
          new CustomError(messages.noDatafoundWithID, StatusCodes.NOT_FOUND)
        );
      }
    } catch (error) {
      reject(error);
    }
  });
}



export default {
  listUser,
  details,
  updateStatus
} as const;





