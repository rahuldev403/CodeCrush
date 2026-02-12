import express, { json } from "express";
import "dotenv/config";
import conncetDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
conncetDb();

const port = 8000 || process.env.PORT;

app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);

app.listen(port, () => {
  console.log(`app is running on port: http://localhost:${port}`);
});
