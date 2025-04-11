import { Router } from "express";
import knowledge_baseController from '@controllers/common_api/knowledge_base';
import { schemaValidator, schemaValidator_forQueryReq } from "@utils/schemaValidator";
import { checkRole, verifyAuthToken } from "@utils/authValidator";
import { delete_baseSchema, knowledge_baseSchema } from "@validators/common/knowledge_base";
import { checkFileSize, upload, uploadMultiple_images } from "@utils/multer";

const route = Router();
const p = {
    addKnowledge_base_content: '/addKnowledge_base_content',
    deleteKnowledge_base_content: '/deleteKnowledge_base_content',
    list: '/list'
};

route.post(p.addKnowledge_base_content, verifyAuthToken, checkRole(['user', 'admin']), upload.fields([{ name: 'file', maxCount: 5 }]), checkFileSize, uploadMultiple_images, schemaValidator_forQueryReq(knowledge_baseSchema), knowledge_baseController.addKnowledge_base_content);
route.patch(p.deleteKnowledge_base_content, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(delete_baseSchema), knowledge_baseController.deleteKnowledge_base_content);
route.get(p.list, verifyAuthToken, checkRole(['user', 'admin']), knowledge_baseController.list);
export default route;