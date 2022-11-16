const eventRouter = require("express").Router();

const {
  getEvents,
  getEventByEventId,
  getUsersByEventId,
  postEvent,
} = require("../controllers/events.controllers");

eventRouter.route("/").get(getEvents).post(postEvent);
eventRouter.get("/:event_id", getEventByEventId);
eventRouter.get("/:event_id/users", getUsersByEventId);

module.exports = eventRouter;
