import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  patchOrder,
} from "../controllers/Order.controller";

const orderRouter = Router();

orderRouter.get("/:id", getOrder);
orderRouter.get("/", getOrders);
orderRouter.post("/", createOrder);
orderRouter.patch("/", patchOrder);

export default orderRouter;
