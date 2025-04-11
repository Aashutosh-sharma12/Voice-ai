import { Router } from "express";
const categoryRouter = Router();
import categoryContoller from "@controllers/admin/category";
import { StatusCodes } from "http-status-codes";
import { checkRole, verifyAuthToken } from "@utils/authValidator";
const { OK, CREATED } = StatusCodes;
import { schemaValidator, schemaValidator_forQueryReq } from "@utils/schemaValidator";
import { CatValidator, editCatValidator } from "@validators/admin/adminValidator";


const p = {
  addCategory: "/add",
  listCategory: "/list",
  editCategory: "/edit",
  delete: "/delete/:id",
  statusUpdate: "/updateStatus",
  details: "/details/:id"
};


categoryRouter.post(
  p.addCategory,
  verifyAuthToken,
  checkRole(["admin"]),
  schemaValidator(CatValidator),
  async (req: any, res: any) => {
    const data = await categoryContoller.addCategory(req?.body, req?.headers);
    res.status(CREATED).json({ code: CREATED, data });
  }
);


categoryRouter.get(
  p.listCategory,
  verifyAuthToken,
  checkRole(["admin"]),
  async (req: any, res: any) => {
    console.log(req.search)
    const data = await categoryContoller.listCategory(req?.query, req?.headers);
    res.status(OK).json({ code: OK, data });
  }
);

categoryRouter.patch(
  p.editCategory,
  verifyAuthToken,
  checkRole(["admin"]),
  schemaValidator(editCatValidator),
  async (req: any, res: any) => {
    const data = await categoryContoller.editCategory(
      req?.body,
      req?.headers
    );
    res.status(OK).json({ data, code: OK });
  }
);

categoryRouter.delete(
  p.delete,
  verifyAuthToken,
  checkRole(["admin"]),
  async (req: any, res: any) => {
    const data = await categoryContoller.deleteCategory(
      req?.params,
      req?.headers
    );
    res.status(OK).json({ data, code: OK });
  }
);

categoryRouter.patch(
  p.statusUpdate,
  verifyAuthToken,
  checkRole(["admin"]),
  // schemaValidator_forQueryReq(),
  async (req: any, res: any) => {
    const data = await categoryContoller.updateStatus(
      req?.body,
      req?.headers,
    );
    res.status(OK).json({ data, code: OK });
  }
);

categoryRouter.get(
  p.details,
  verifyAuthToken,
  checkRole(["admin"]),
  async (req: any, res: any) => {
    const data = await categoryContoller.details(
      req?.params,
      req?.headers
    );
    res.status(OK).json({ code: OK, data });
  }
);



export default categoryRouter;
