import { Router } from "express";
const industoryRouter = Router();
import industoryContoller from "@controllers/admin/industory";
import { StatusCodes } from "http-status-codes";
import { checkRole, verifyAuthToken } from "@utils/authValidator";
const { OK, CREATED } = StatusCodes;


import {
  schemaValidator,
  schemaValidator_forQueryReq,
} from "@utils/schemaValidator";
import { IndValidator } from "@validators/admin/adminValidator";


const p = {
  addIndustory: "/add",
  listIndustory: "/list",
  editIndustory: "/edit/:id",
  delete: "/delete/:id",
  statusUpdate: "/updateStatus",
  details: "/details/:id"
};


industoryRouter.post(
  p.addIndustory,
  verifyAuthToken,
  checkRole(["admin"]),
  schemaValidator(IndValidator),
  async (req: any, res: any) => {
    const data = await industoryContoller.addIndustory(req?.body, req?.headers);
    res.status(CREATED).json({ code: CREATED, data });
  }
);


industoryRouter.get(
  p.listIndustory,
  verifyAuthToken,
  checkRole(["admin"]),
  async (req: any, res: any) => {
    const data = await industoryContoller.listIndustory(req?.query, req?.headers);
    res.status(OK).json({ code: OK, data });
  }
);

industoryRouter.patch(
  p.editIndustory,
  verifyAuthToken,
  checkRole(["admin"]),
  schemaValidator(IndValidator),
  async (req: any, res: any) => {
    const data = await industoryContoller.editIndustory(
      req?.body,
      req?.params,
      req?.headers
    );
    res.status(OK).json({ data, code: OK });
  }
);

industoryRouter.delete(
  p.delete,
  verifyAuthToken,
  checkRole(["admin"]),
  async (req: any, res: any) => {
    const data = await industoryContoller.deleteIndustory(
      req?.params,
      req?.headers
    );
    res.status(OK).json({ data, code: OK });
  }
);

industoryRouter.patch(
  p.statusUpdate,
  verifyAuthToken,
  checkRole(["admin"]),
  // schemaValidator_forQueryReq(),
  async (req: any, res: any) => {
    const data = await industoryContoller.updateStatus(
      req?.body,
      req?.headers,
    );
    res.status(OK).json({ data, code: OK });
  }
);

industoryRouter.get(
  p.details,
  verifyAuthToken,
  checkRole(["admin"]),
  async (req: any, res: any) => {
    const data = await industoryContoller.details(
      req?.params,
      req?.headers
    );
    res.status(OK).json({ code: OK, data });
  }
);



export default industoryRouter;
