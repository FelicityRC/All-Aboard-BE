const { selectEvents } = require("../models/events.models");

exports.getEvents = (req, res, next) => {
  selectEvents().then((events) => {
    res.status(200).send({ events });
  });
};
