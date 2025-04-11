import { Router } from "express";
const userRouter = Router();
import userContoller from "@controllers/admin/user";
import { StatusCodes } from "http-status-codes";
import { checkRole, verifyAuthToken } from "@utils/authValidator";
const { OK, CREATED } = StatusCodes;
import { schemaValidator, schemaValidator_forQueryReq } from "@utils/schemaValidator";



const p = {
  listCategory: "/list",
  statusUpdate: "/updateStatus",
  details: "/details/:id"
};


userRouter.get(
  p.listCategory,
  verifyAuthToken,
  checkRole(["admin"]),
  async (req: any, res: any) => {
    const data = await userContoller.listUser(req?.query, req?.headers);
    res.status(OK).json({ code: OK, data });
  }
);


userRouter.patch(
  p.statusUpdate,
  verifyAuthToken,
  checkRole(["admin"]),
  async (req: any, res: any) => {
    console.log(req.body, "jsdfja")
    const data = await userContoller.updateStatus(
      req?.body,
      req?.headers,
    );
    res.status(OK).json({ data, code: OK });
  }
);

userRouter.get(
  p.details,
  verifyAuthToken,
  checkRole(["admin"]),
  async (req: any, res: any) => {
    const data = await userContoller.details(
      req?.params,
      req?.headers
    );
    res.status(OK).json({ code: OK, data });
  }
);



export default userRouter;
