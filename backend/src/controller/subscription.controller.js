import mongoose, {isValidObjectId} from "mongoose";
import {User} from "../model/user.model.js";
import {Subscription} from "../model/subscription.model.js";
import {APIError} from "../utility/APIError.js";
import {APIResponse} from "../utility/APIResponse.js";
import {asyncHandler} from "../utility/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const {channelId} = req.params;
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const {channelId} = req.params;
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const {subsciberId} = req.params;
});

export {toggleSubscription, getSubscribedChannels, getUserChannelSubscribers};
