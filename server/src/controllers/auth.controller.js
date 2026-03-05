const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const AppError = require('../utils/AppError');

exports.register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  
  res.status(201).json({
    status: 'success',
    data: result
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshTokens(refreshToken);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.logout = catchAsync(async (req, res) => {
  await authService.logout(req.user.id);
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});