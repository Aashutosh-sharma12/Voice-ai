import messages from "@Custom_message/index";
import { categoryModel } from "@models/category";
import { CustomError } from "@utils/errors";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

function addCategory(body: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      body.lower_name = body.name.toLowerCase()
      const findCategoryByName = await categoryModel.findOne({
        isDelete: false,
        addBy: "admin",
        lower_name: body.lower_name,
      });
      if (findCategoryByName) {
        reject(
          new CustomError(
            messages.AlreadyExist.replace("{{key1}}", 'Category').replace("{{key2}}", `${body.name}`), StatusCodes.BAD_REQUEST)
        );
      } else {
        const resultData = await categoryModel.create(body);
        if (resultData) {
          resolve(resultData);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}


function listCategory(query: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { search, isActive } = query;
      const page = parseInt(query?.page) || 1;
      const perPage = parseInt(query?.perPage) || 10;
      let obj: any = {
        isDelete: false
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

      if (isActive === "Active") {
        obj = { ...obj, isActive: true }
      } else if (isActive === "InActive") {
        obj = { ...obj, isActive: false }
      } else if (isActive === "all") {
        obj = { ...obj }
      } else {
        obj = { ...obj }
      }

      const [CategoryData, Count] = await Promise.all([categoryModel.find(obj, { isDelete: false }).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage), categoryModel.countDocuments(obj)])

      resolve({ totalCount: Count, category_data: CategoryData });
    } catch (error) {
      reject(error);
    }
  });
}

function editCategory(body: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = body;
      body.lower_name = body.name.toLowerCase()
      const findCategory: any = await categoryModel.findOne({
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
            messages.AlreadyExist.replace("{{key1}}", 'Category').replace("{{key2}}", `${body.name}`), StatusCodes.BAD_REQUEST)
        );
      } else {
        const update = await categoryModel.findOneAndUpdate(
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
      const updataeStatus = await categoryModel.findOneAndUpdate(
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


function deleteCategory(params: any, headers: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = params;
      const findCategoryByID: any = await categoryModel.findOneAndUpdate(
        { _id: id, isDelete: false },
        {
          isDelete: true,
        },
        {
          new: true,
        }
      )
      if (!findCategoryByID) {
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
      const findCategoryById = await categoryModel.findOne({
        _id: id,
        isDelete: false,
      }
      );
      if (findCategoryById) {
        resolve(findCategoryById);
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
  addCategory,
  listCategory,
  editCategory,
  updateStatus,
  deleteCategory,
  details
} as const;