import express, { Application } from "express";
import { createConnection } from "typeorm";
import "reflect-metadata";
import cors from "cors";
import routes from "./routes";

const app: Application = express();

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

app.listen(PORT, async (): Promise<void> => {
  console.log(`🎉 Running at https://localhost:${PORT}`);

  let retries = 5;

  while (retries) {
    try {
      await createConnection({
        type: "postgres",
        host: "db",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "postgres",
        entities: [__dirname + "/entity/*.{ts,js}"],
        synchronize: true,
      });
      break;
    } catch (error) {
      console.log(error);
      retries -= 1;
      console.log(`retries left: ${retries}`);

      // wait 5 seconds
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
});
