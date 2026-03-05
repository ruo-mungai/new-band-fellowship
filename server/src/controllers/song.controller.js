const catchAsync = require('../utils/catchAsync');
const songService = require('../services/song.service');
const AppError = require('../utils/AppError');

exports.createRequest = catchAsync(async (req, res) => {
  const request = await songService.createRequest(req.user.id, req.body);
  
  res.status(201).json({
    status: 'success',
    data: { request }
  });
});

exports.getRequests = catchAsync(async (req, res) => {
  const filters = {
    status: req.query.status,
    userId: req.query.userId,
    search: req.query.search,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10
  };

  const result = await songService.getRequests(filters);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.toggleVote = catchAsync(async (req, res) => {
  const result = await songService.toggleVote(req.user.id, req.params.requestId);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.updateStatus = catchAsync(async (req, res) => {
  const { status, scheduledDate } = req.body;
  const request = await songService.updateStatus(req.params.requestId, status, scheduledDate);
  
  res.status(200).json({
    status: 'success',
    data: { request }
  });
});

exports.getStats = catchAsync(async (req, res) => {
  const stats = await songService.getStats();
  
  res.status(200).json({
    status: 'success',
    data: stats
  });
});

// Song master
exports.getAllSongs = catchAsync(async (req, res) => {
  const songs = await songService.getAllSongs(req.query.search);
  
  res.status(200).json({
    status: 'success',
    data: { songs }
  });
});

exports.addSong = catchAsync(async (req, res) => {
  const song = await songService.addSong(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { song }
  });
});

exports.updateSong = catchAsync(async (req, res) => {
  const song = await songService.updateSong(req.params.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { song }
  });
});

exports.deleteSong = catchAsync(async (req, res) => {
  const result = await songService.deleteSong(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});