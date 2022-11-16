const eventRouter = require("express").Router();

const {
  getEvents,
  getEventByEventId,
  getUsersByEventId,
} = require("../controllers/events.controllers");

eventRouter.get("/", getEvents);
eventRouter.get("/:event_id", getEventByEventId);
eventRouter.get("/:event_id/users", getUsersByEventId);

module.exports = eventRouter;
