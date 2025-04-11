import messages from "@Custom_message/index";
import { industryModel } from "@models/category";
import { CustomError } from "@utils/errors";
import { StatusCodes } from "http-status-codes";
import moment from "moment";

function addIndustory(body: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      body.lower_name = body.name.toLowerCase()
      const findIndustoryByName = await industryModel.findOne({
        isDelete: false,
        addBy: "admin",
        lower_name: body.lower_name,
      });
      if (findIndustoryByName) {
        reject(
          new CustomError(
            messages.AlreadyExist.replace("{{key1}}", 'Industory').replace("{{key2}}", `${body.name}`), StatusCodes.BAD_REQUEST)
        );
      } else {
        const resultData = await industryModel.create(body);
        if (resultData) {
          resolve(resultData);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}


function listIndustory(query: any, headers: any): Promise<any> {
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
            { lower_name: { $regex: search, $options: "i" } },
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
      }
      else if (isActive === "InActive") {
        obj = { ...obj, isActive: false }
      } else if (isActive === "all") {
        obj = { ...obj }
      } else {
        obj = { ...obj }
      }

      const totalDocument = await industryModel.countDocuments(obj);

      const findIndustory = await industryModel.aggregate([
        {
          $match: obj,
        },
        {
          $skip: skip,
        },
        {
          $limit: perPage,
        },
        {
          $sort: { createdAt: -1 }
        },
      ]);
      resolve({ totalCount: totalDocument, industory_data: findIndustory });
    } catch (error) {
      reject(error);
    }
  });
}

function editIndustory(body: any, params: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = params;
      body.lower_name = body.name.toLowerCase()
      const findCategory: any = await industryModel.findOne({
        lower_name: body.lower_name,
        addBy: "admin",
        isDelete: false,
        _id: {
          $ne: id,
        },
      });
      if (findCategory) {
        reject(
          new CustomError(
            messages.AlreadyExist.replace("{{key1}}", 'Industory').replace("{{key2}}", `${body.name}`), StatusCodes.BAD_REQUEST)
        );
      } else {
        const update = await industryModel.findOneAndUpdate(
          { _id: id, isDelete: false },
          {
            name: body?.name,
            lower_name: body?.lower_name,
            isActive: body?.isActive,
          },
          { new: true }
        )
        resolve(update)
      }
    } catch (error) {
      reject(error)
    }
  }
  )
}

function updateStatus(body: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { isActive, id } = body;
      const updataeStatus = await industryModel.findOneAndUpdate(
        { _id: id, isDelete: false },
        { isActive: isActive },
        {
          new: true
        }
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
    };
  });
}


function deleteIndustory(params: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = params;
      const findIndustoryByID: any = await industryModel.findOneAndUpdate(
        { _id: id, isDelete: false },
        {
          isDelete: true,
        },
        {
          new: true,
        }
      )
      if (!findIndustoryByID) {
        reject(
          new CustomError(messages.noDatafoundWithID, StatusCodes.NOT_FOUND)
        );
      } else {
        resolve({ success: true });
      }
    } catch (err) {
      reject(err);
    }
  });
}

function details(params: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = params;
      const findIndustoryById = await industryModel.findOne({
        _id: id,
        isDelete: false,
      }
      );
      if (findIndustoryById) {
        resolve(findIndustoryById);
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
  addIndustory,
  listIndustory,
  editIndustory,
  updateStatus,
  deleteIndustory,
  details
} as const;