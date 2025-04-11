import messages from "@Custom_message/index";
import { knowledge_baseModel } from "@models/index";
import { CustomError } from "@utils/errors";
import { convertToJsonFromUrl } from "@utils/helpers";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
const { OK, CREATED } = StatusCodes;
const addKnowledge_base_content = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user
        const fileUrls = req.files
        const results = [];
        if (!fileUrls || !fileUrls.length) {
            throw new CustomError(messages.fileUploadError, StatusCodes.BAD_REQUEST);
        }
        for (const file of fileUrls) {
            let body: any = {
                fileUrl: file,
                uploadBy: role
            }
            if (role == 'user') {
                body = {
                    ...body,
                    userId: id,
                }
            }
            const convertToJSONFromUrl = await convertToJsonFromUrl(file);
            body.file_content = convertToJSONFromUrl
            const data = await knowledge_baseModel.create(body);
            results.push(data);
        };
        res.status(CREATED).json({ data: results, code: CREATED });
    } catch (err) {
        next(err);
    }
}
const deleteKnowledge_base_content = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user
        const { knowledge_baseIds, deleteAll } = req.body
        let cond: any = {
            _id: knowledge_baseIds,
            isDelete: false

        }
        if (role == 'user') {
            cond = {
                ...cond,
                userId: id,
            }
        }
        if (deleteAll) {
            cond = {
                isDelete: false
            }
        }
        const data = await knowledge_baseModel.updateMany(cond, { isDelete: true });
        if (data) {
            res.status(OK).json({ data: { success: true }, code: OK });
        } else {
            throw new CustomError(messages.noDatafound, StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        next(err);
    }
}

const list = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user
        const { page = 1, perPage = 10 } = req.query;
        let cond: any = {
            isDelete: false,
            isActive: true
        }
        if (role == 'user') {
            cond = {
                ...cond,
                $or: [
                    { userId: id },
                    {
                        uploadBy: {
                            $in: ['admin']
                        }
                    }
                ]
            }
        }
        const [list, count] = await Promise.all([
            knowledge_baseModel.find(cond).sort({ createdAt: -1 }).skip(Number(perPage * page) - Number(perPage)).limit(Number(perPage)),
            knowledge_baseModel.countDocuments(cond)
        ]);
        res.status(OK).json({ itemList: list, totalCount: count, code: OK });
    } catch (err) {
        next(err);
    }
}

export = {
    addKnowledge_base_content,
    deleteKnowledge_base_content,
    list
}