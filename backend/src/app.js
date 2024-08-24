import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "DELETE", "GET"],
    credentials: true,
  })
);

// touter

import userRouter from "../src/routers/user.routes.js";
import tweetRouter from "../src/routers/tweet.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweet", tweetRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server Is listening " });
});
export { app };
