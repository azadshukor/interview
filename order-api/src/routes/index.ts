import { Router } from "express";
import orderRouter from "./order";

const routes = Router();

routes.use("/order", orderRouter);

export default routes;
