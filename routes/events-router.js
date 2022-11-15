const eventRouter = require("express").Router();

const {
  getEvents,
  getEventByEventId,
  postEvent,
} = require("../controllers/events.controllers");

eventRouter.route("/").get(getEvents).post(postEvent);
eventRouter.get("/:event_id", getEventByEventId);

module.exports = eventRouter;
