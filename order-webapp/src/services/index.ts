import axios from "axios";
import { IOrderBody, IOrderObj, IPatchOrderBody } from "src/interfaces";

const baseUrl = "http://localhost:8080/order";

export const OrderService = {
  GetOrders: async (): Promise<IOrderObj[] | null> => {
    try {
      return axios.get(baseUrl).then((res) => res.data);
    } catch (error) {
      return null;
    }
  },

  GetOrder: async (id: string): Promise<IOrderObj | null> => {
    try {
      return axios.get(`${baseUrl}/${id}`).then((res) => res.data);
    } catch (error) {
      return null;
    }
  },

  PostOrder: async (body: IOrderBody): Promise<IOrderObj | null> => {
    try {
      return axios.post(baseUrl, body).then((res) => res.data);
    } catch (error) {
      return null;
    }
  },

  PatchOrder: async (body: IPatchOrderBody): Promise<IOrderObj | null> => {
    try {
      return axios.patch(baseUrl, body).then((res) => res.data);
    } catch (error) {
      return null;
    }
  },
};
