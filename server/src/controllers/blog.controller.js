const catchAsync = require('../utils/catchAsync');
const blogService = require('../services/blog.service');
const AppError = require('../utils/AppError');

// Public routes
exports.getPublishedPosts = catchAsync(async (req, res) => {
  const filters = {
    ...req.query,
    published: true
  };

  const result = await blogService.getAllPosts(filters);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getPostBySlug = catchAsync(async (req, res) => {
  const post = await blogService.getPostBySlug(req.params.slug);
  
  res.status(200).json({
    status: 'success',
    data: { post }
  });
});

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await blogService.getAllCategories();
  
  res.status(200).json({
    status: 'success',
    data: { categories }
  });
});

exports.getTags = catchAsync(async (req, res) => {
  const tags = await blogService.getAllTags();
  
  res.status(200).json({
    status: 'success',
    data: { tags }
  });
});

// Protected routes (require login)
exports.addComment = catchAsync(async (req, res) => {
  const comment = await blogService.addComment(req.user.id, req.params.postId, req.body);
  
  res.status(201).json({
    status: 'success',
    data: { comment }
  });
});

// Admin routes
exports.getAllPosts = catchAsync(async (req, res) => {
  const result = await blogService.getAllPosts(req.query);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getPost = catchAsync(async (req, res) => {
  const post = await blogService.getPostById(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { post }
  });
});

exports.createPost = catchAsync(async (req, res) => {
  const post = await blogService.createPost(req.user.id, req.body);
  
  res.status(201).json({
    status: 'success',
    data: { post }
  });
});

exports.updatePost = catchAsync(async (req, res) => {
  const post = await blogService.updatePost(req.params.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { post }
  });
});

exports.deletePost = catchAsync(async (req, res) => {
  const result = await blogService.deletePost(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Category management
exports.createCategory = catchAsync(async (req, res) => {
  const category = await blogService.createCategory(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { category }
  });
});

exports.updateCategory = catchAsync(async (req, res) => {
  const category = await blogService.updateCategory(req.params.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { category }
  });
});

exports.deleteCategory = catchAsync(async (req, res) => {
  const result = await blogService.deleteCategory(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Tag management
exports.createTag = catchAsync(async (req, res) => {
  const tag = await blogService.createTag(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { tag }
  });
});

exports.updateTag = catchAsync(async (req, res) => {
  const tag = await blogService.updateTag(req.params.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { tag }
  });
});

exports.deleteTag = catchAsync(async (req, res) => {
  const result = await blogService.deleteTag(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Comment moderation
exports.getComments = catchAsync(async (req, res) => {
  const result = await blogService.getComments(req.params.postId, req.query);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.approveComment = catchAsync(async (req, res) => {
  const comment = await blogService.approveComment(req.params.commentId);
  
  res.status(200).json({
    status: 'success',
    data: { comment }
  });
});

exports.deleteComment = catchAsync(async (req, res) => {
  const result = await blogService.deleteComment(req.params.commentId);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Blog stats
exports.getBlogStats = catchAsync(async (req, res) => {
  const stats = await blogService.getStats();
  
  res.status(200).json({
    status: 'success',
    data: stats
  });
});