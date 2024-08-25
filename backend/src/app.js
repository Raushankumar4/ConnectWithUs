import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTED_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routers
import userRouter from "./routers/user.routes.js";
import tweetRouter from "./routers/tweet.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweet", tweetRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server Is listening" });
});

export { app };
