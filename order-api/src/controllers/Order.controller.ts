import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ORDER_STATES } from "../constants/Order.constant";
import { OrderCreateDTO, OrderPatchDTO } from "../dto/Order.dto";
import { Order } from "../entity/Order.entity";
import { getPaymentResponse } from "../providers/Payment.provider";

const isNotValidState = (state: string): boolean => {
  return ORDER_STATES.indexOf(state.toUpperCase()) == -1;
};

const getOrders = async (_: Request, res: Response): Promise<Response> => {
  try {
    const orderRepository = getRepository(Order);
    const response = await orderRepository.find();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get all orders." });
  }
};

const getOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id) return res.status(500).json({ message: "Please provide and id." });

    const orderRepository = getRepository(Order);
    const response = await orderRepository.findOne({ id });

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get order." });
  }
};

const createOrder = async (req: Request, res: Response): Promise<Response> => {
  const { price, station } = req.body as OrderCreateDTO;

  if (!price)
    return res.status(500).json({ message: "Please insert a price." });

  if (!station)
    return res.status(500).json({ message: "Please insert a station." });

  const order = {
    state: ORDER_STATES[0],
    price,
    station,
  };

  try {
    const orderRepository = getRepository(Order);
    const response = await orderRepository.save(order);
    const { id } = response;

    const isValidPayment = await getPaymentResponse("token");

    if (isValidPayment) {
      await orderRepository.save({
        id,
        state: ORDER_STATES[2],
      });

      return res
        .status(500)
        .json({ message: "Payment declined, please try again later." });
    }

    // update database after sometime
    setTimeout(async () => {
      orderRepository.save({
        id: response.id,
        state: ORDER_STATES[3],
      });
    }, 10000);

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create order." });
  }
};

const patchOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, state } = req.body as OrderPatchDTO;

    if (!id) {
      return res.status(500).json({ message: "Please provide and id." });
    }

    if (!state) {
      return res.status(500).json({ message: "Please provide a state." });
    }

    if (isNotValidState(state)) {
      return res.status(500).json({
        message:
          "Wrong state. Please provide either CREATED, CONFIRMED,CANCELLED or DELIVERED",
      });
    }

    const orderRepository = getRepository(Order);
    const respFindOrder = await orderRepository.findOne({ id });

    if (!respFindOrder)
      return res.status(500).json({ message: "Failed to find order." });

    if (respFindOrder.state == ORDER_STATES[3]) {
      return res.status(500).json({
        message: "Order has been delivered. Please refresh your application.",
      });
    }

    const response = await orderRepository.save({ id, state });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel order." });
  }
};

export { getOrders, createOrder, getOrder, patchOrder };
