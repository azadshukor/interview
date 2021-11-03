import axios from "axios";

const paymentBaseUrl = "http://payment-api:8000/";

export const getPaymentResponse = async (token: string) => {
  const body = { token };
  return await axios.post(paymentBaseUrl, body).then((res) => {
    return res.data.status;
  });
};
