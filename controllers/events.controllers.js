const {
  selectEvents,
  selectEventByEventId,
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
    .catch((err) => {
      next(err);
    });
};
