import mongoose from "mongoose";
import {APIError} from "../utility/APIError.js";
import {APIResponse} from "../utility/APIResponse.js";
import {asyncHandler} from "../utility/asyncHandler.js";
import {Like} from "../model/likes.model.js";
import {Subscription} from "../model/subscription.model.js";
import {Video} from "../model/video.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const {channelId} = req.params;
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const {channelId} = req.params;
});

export {getChannelStats, getChannelVideos};
