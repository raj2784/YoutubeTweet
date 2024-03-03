import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // to excess cookie from user browser

const app = express();

app.use(
  cors({
    orign: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({limit: "32kb"}));
app.use(express.urlencoded({extended: true, limit: "32kdb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

//e.g. URL
//https:localhost:8000/api/v1/users/register

export {app};
