import { Router } from "express";
import addController from '@controllers/user/add';
import { schemaValidator, schemaValidator_forQueryReq } from "@utils/schemaValidator";
import { checkRole, verifyAuthToken } from "@utils/authValidator";
import { catSchema, industrySchema } from "@validators/user/add";

const route = Router();
const p = {
    addCategory: '/addCategory',
    addIndustry: '/addIndustry',
};

route.post(p.addCategory, verifyAuthToken, checkRole(['user']), schemaValidator(catSchema), addController.addCategory);
route.post(p.addIndustry, verifyAuthToken, checkRole(['user']), schemaValidator(industrySchema), addController.addIndustry);

export default route;