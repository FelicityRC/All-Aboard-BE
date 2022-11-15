const eventRouter = require("express").Router();

const {
  getEvents,
  getEventByEventId,
} = require("../controllers/events.controllers");

eventRouter.get("/", getEvents);
eventRouter.get("/:event_id", getEventByEventId);

module.exports = eventRouter;
