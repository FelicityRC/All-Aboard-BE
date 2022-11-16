const {
  selectEvents,
  selectEventByEventId,
  insertEvent,
  updateEvent,
  selectUsersByEventId,
} = require("../models/events.models");

exports.getEvents = (req, res, next) => {
  selectEvents().then((events) => {
    res.status(200).send({ events });
  });
};

exports.getEventByEventId = (req, res, next) => {
  const eventId = req.params.event_id;

  selectEventByEventId(eventId)
    .then((event) => {
      res.status(200).send({ event });
    })
    .catch((err) => next(err));
};

exports.postEvent = (req, res, next) => {
  const body = req.body;
  insertEvent(body)
    .then((event) => {
      res.status(201).send({ event });
    })
    .catch((err) => next(err));
};

exports.patchEvent = (req, res, next) => {
  const event_id = req.params.event_id;
  const body = req.body;

  updateEvent(event_id, body)
    .then((event) => {
      res.status(200).send({ event });
      
exports.getUsersByEventId = (req, res, next) => {
  const event_id = req.params.event_id;

  selectUsersByEventId(event_id)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};
