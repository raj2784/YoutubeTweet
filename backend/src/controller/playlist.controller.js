import monoogse, {isValidObjectId} from "mongoose";
import {asyncHandler} from "../utility/asyncHandler.js";
import {APIError} from "../utility/APIError.js";
import {APIResponse} from "../utility/APIResponse.js";
import {Playlist} from "../model/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const {name, description} = req.body;
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  const {userId} = req.params;
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const {playlistId} = req.params;
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const {playlistId, videoId} = req.params;
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const {playlistId} = req.params;
});

const updatePalylist = asyncHandler(async (req, res) => {
  const {playlistId} = req.params;
  const {name, description} = req.body;
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const {playlistId} = req.params;
});

export {
  createPlaylist,
  getUserPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updatePalylist,
  deletePlaylist,
};
