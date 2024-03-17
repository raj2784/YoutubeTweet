import {asyncHandler} from "../utility/asyncHandler";
import mongoose from "mongoose";
import {APIError} from "../utility/APIError";
import {APIResponse} from "../utility/APIResponse";
import {Commnet} from "../model/comment.model";

const getVideoComment = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
  const {page = 1, limit = 10} = req.query;
});

const addComment = asyncHandler(async (req, res) => {});

const updateCommnet = asyncHandler(async (req, res) => {});

const deleteComment = asyncHandler(async (req, res) => {});

export {getVideoComment, addComment, updateCommnet, deleteComment};
