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

//routes import
import userRouter from "./routes/user.routes.js";
import healthChekRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import videoRouter from "./routes/video.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/healthchecks", healthChekRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/dashboard", dashboardRouter);

//e.g. URL
//https:localhost:8000/api/v1/users/register

export {app};
