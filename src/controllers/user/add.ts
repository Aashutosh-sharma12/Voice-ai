import messages from "@Custom_message/index";
import { categoryModel, industryModel } from "@models/index";
import { CustomError } from "@utils/errors";
import { Request, Response, NextFunction } from "express";
import StatusCodes from "http-status-codes";
const { CREATED } = StatusCodes;

const addCategory = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { role, id } = req.user;
        const { name } = req.body;
        const lower_name = name.toLowerCase();
        let cond = {
            isDelete: false,
            lower_name: lower_name,
            $or: [
                { userId: id },
                { addBy: 'admin' }
            ]
        }
        const check = await categoryModel.findOne(cond);
        if (check) {
            throw new CustomError(messages.AlreadyExist.replace("{{key1}}", 'Category').replace("{{key2}}", name), StatusCodes.BAD_REQUEST);
        } else {
            req.body = {
                ...req.body,
                userId: id,
                addBy: role,
                lower_name: lower_name
            }
            const add = await categoryModel.create(req.body);
            res.status(CREATED).json({ code: CREATED, data: add });
        }
    } catch (err) {
        next(err);
    }
}

const addIndustry = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { role, id } = req.user;
        const { name } = req.body;
        const lower_name = name.toLowerCase();
        let cond = {
            isDelete: false,
            lower_name: lower_name,
            $or: [
                { userId: id },
                { addBy: 'admin' }
            ]
        }
        const check = await industryModel.findOne(cond);
        if (check) {
            throw new CustomError(messages.AlreadyExist.replace("{{key1}}", 'Industry').replace("{{key2}}", name), StatusCodes.BAD_REQUEST);
        } else {
            req.body = {
                ...req.body,
                userId: id,
                addBy: role,
                lower_name: lower_name
            }
            const add = await industryModel.create(req.body);
            res.status(CREATED).json({ code: CREATED, data: add });
        }
    } catch (err) {
        next(err);
    }
}

export = {
    addCategory,
    addIndustry
} as const;