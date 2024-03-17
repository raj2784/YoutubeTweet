import mongoose, {isValidObjectId} from "mongoose";
import {User} from "../model/user.model";
import {asyncHandler} from "../utility/asyncHandler";
import {APIError} from "../utility/APIError";
import {APIResponse} from "../utility/APIResponse";
import {Tweet} from "../model/tweet.model";

const createTweet = asyncHandler(async (req, res) => {});

const getUserTweets = asyncHandler(async (req, res) => {});

const updateTweet = asyncHandler(async (req, res) => {});

const deleteTweet = asyncHandler(async (req, res) => {});

export {createTweet, updateTweet, getUserTweets, deleteTweet};
