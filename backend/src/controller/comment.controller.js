import {asyncHandler} from "../utility/asyncHandler.js";
import mongoose from "mongoose";
import {APIError} from "../utility/APIError.js";
import {APIResponse} from "../utility/APIResponse.js";
import {Commnet} from "../model/comment.model.js";

const getVideoComment = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  const {page = 1, limit = 10} = req.query;
});

const addComment = asyncHandler(async (req, res) => {});

const updateComment = asyncHandler(async (req, res) => {});

const deleteComment = asyncHandler(async (req, res) => {});

export {getVideoComment, addComment, updateComment, deleteComment};
