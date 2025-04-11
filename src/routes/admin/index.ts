import industory from "@controllers/admin/industory";
import { Router } from "express";
import industoryRouter from "./industries";
import categoryRouter from "./category";
import userRouter from "./user";
import authRoute from "./auth";
// import transection_router from "./transectionInfo";

const baserouter = Router();

baserouter.use('/industries', industoryRouter )
baserouter.use('/category', categoryRouter )
baserouter.use('/user', userRouter )
baserouter.use("/auth", authRoute);
export default baserouter;
