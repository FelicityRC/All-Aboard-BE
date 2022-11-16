const eventRouter = require("express").Router();

const {
  getEvents,
  getEventByEventId,
  getUsersByEventId,
  postEvent,
  patchEvent,
} = require("../controllers/events.controllers");

eventRouter.route("/").get(getEvents).post(postEvent);
eventRouter.route("/:event_id").get(getEventByEventId).patch(patchEvent);
eventRouter.get("/:event_id/users", getUsersByEventId);

module.exports = eventRouter;
