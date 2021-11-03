import express, { Application, Request, Response } from "express";

import cors from "cors";

const app: Application = express();

const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", function (req: Request, res: Response): Response {
  return res.status(200).json({ message: "healthy" });
});

app.post("/", function (req: Request, res: Response): Response {
  const { token } = req.body;
  // token received from order-api
  console.log(token);

  const status: boolean = Math.random() < 0.5;
  return res.status(200).json({ status });
});

app.listen(PORT, async (): Promise<void> => {
  console.log(`🎉 Running at https://localhost:${PORT}`);
});
