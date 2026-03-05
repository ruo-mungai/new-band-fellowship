const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const AppError = require('../utils/AppError');

exports.getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await userService.changePassword(req.user.id, currentPassword, newPassword);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Admin controllers
exports.approveUser = catchAsync(async (req, res) => {
  const user = await userService.approveUser(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.banUser = catchAsync(async (req, res) => {
  const user = await userService.banUser(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.unbanUser = catchAsync(async (req, res) => {
  const user = await userService.unbanUser(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.changeUserRole = catchAsync(async (req, res) => {
  const { role } = req.body;
  const user = await userService.changeUserRole(req.params.id, role);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getUserStats = catchAsync(async (req, res) => {
  const stats = await userService.getUserStats();
  
  res.status(200).json({
    status: 'success',
    data: stats
  });
});