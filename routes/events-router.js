const eventRouter = require("express").Router();

const {
  getEvents,
  getEventByEventId,
  getUsersByEventId,
  getGamesByEventId,
  postEvent,
  patchEvent,
  deleteEvent,
  postUserToUserEvents,
  postGameToEventGames,
} = require("../controllers/events.controllers");

eventRouter.route("/").get(getEvents).post(postEvent);
eventRouter
  .route("/:event_id")
  .get(getEventByEventId)
  .patch(patchEvent)
  .delete(deleteEvent);

eventRouter
  .route("/:event_id/users")
  .get(getUsersByEventId)
  .post(postUserToUserEvents);

eventRouter
  .route("/:event_id/games")
  .get(getGamesByEventId)
  .post(postGameToEventGames);

module.exports = eventRouter;
