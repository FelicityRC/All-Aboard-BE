const eventRouter = require("express").Router();

const {
  getEvents,
  getEventByEventId,
  postEvent,
  patchEvent,
} = require("../controllers/events.controllers");

eventRouter.route("/").get(getEvents).post(postEvent);
eventRouter.route("/:event_id").get(getEventByEventId).patch(patchEvent);

module.exports = eventRouter;
