import express from "express";
import env from "./config/env";
import taskRouter from "./routes/tasks/tasks.routes";
import authRouter from "./routes/auth/auth.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

app.listen(env.PORT, () => {
  console.log(`\r\nServer is listening on port ${env.PORT}\r\n`);
});
