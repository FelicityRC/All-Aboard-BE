const eventRouter = require("express").Router();

const {
  getEvents,
  getEventByEventId,
  getUsersByEventId,
  postEvent,
  patchEvent,
  deleteEvent,
} = require("../controllers/events.controllers");

eventRouter.route("/").get(getEvents).post(postEvent);
eventRouter
  .route("/:event_id")
  .get(getEventByEventId)
  .patch(patchEvent)
  .delete(deleteEvent);
eventRouter.get("/:event_id/users", getUsersByEventId);

module.exports = eventRouter;
