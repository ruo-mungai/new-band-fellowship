const catchAsync = require('../utils/catchAsync');
const eventService = require('../services/event.service');
const AppError = require('../utils/AppError');

exports.createEvent = catchAsync(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { event }
  });
});

exports.getAllEvents = catchAsync(async (req, res) => {
  const includePast = req.query.includePast === 'true';
  const events = await eventService.getAllEvents(includePast);
  
  res.status(200).json({
    status: 'success',
    data: { events }
  });
});

exports.getEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { event }
  });
});

exports.updateEvent = catchAsync(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { event }
  });
});

exports.deleteEvent = catchAsync(async (req, res) => {
  const result = await eventService.deleteEvent(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Sessions
exports.updateSession = catchAsync(async (req, res) => {
  const session = await eventService.updateSession(req.params.sessionId, req.body);
  
  res.status(200).json({
    status: 'success',
    data: { session }
  });
});

exports.reorderSessions = catchAsync(async (req, res) => {
  const result = await eventService.reorderSessions(req.params.eventId, req.body.sessions);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// RSVP
exports.createRSVP = catchAsync(async (req, res) => {
  const rsvp = await eventService.createRSVP(req.user.id, req.params.eventId, req.body);
  
  res.status(201).json({
    status: 'success',
    data: { rsvp }
  });
});

exports.cancelRSVP = catchAsync(async (req, res) => {
  const result = await eventService.cancelRSVP(req.user.id, req.params.eventId);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});