const catchAsync = require('../utils/catchAsync');
const playlistService = require('../services/playlist.service');
const AppError = require('../utils/AppError');

exports.getPlaylist = catchAsync(async (req, res) => {
  const playlist = await playlistService.getPlaylistByEvent(req.params.eventId);
  
  res.status(200).json({
    status: 'success',
    data: { playlist }
  });
});

exports.addItem = catchAsync(async (req, res) => {
  const item = await playlistService.addItem(req.params.playlistId, req.body);
  
  res.status(201).json({
    status: 'success',
    data: { item }
  });
});

exports.updateItem = catchAsync(async (req, res) => {
  const item = await playlistService.updateItem(req.params.itemId, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { item }
  });
});

exports.removeItem = catchAsync(async (req, res) => {
  const result = await playlistService.removeItem(req.params.itemId);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.reorderItems = catchAsync(async (req, res) => {
  const result = await playlistService.reorderItems(req.params.playlistId, req.body.items);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.markAsSung = catchAsync(async (req, res) => {
  const result = await playlistService.markAsSung(req.params.itemId);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});