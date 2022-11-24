const {
  selectEvents,
  selectEventByEventId,
  insertEvent,
  updateEvent,
  selectUsersByEventId,
  selectGamesByEventId,
  removeEvent,
  insertUserToUserEvents,
  insertGameToEventGames,
  checkEvent,
} = require("../models/events.models");
const { selectGameByGameId } = require("../models/games.models");
const { selectUserByUserId } = require("../models/users.models");

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
    .catch((err) => next(err));
};

exports.postEvent = (req, res, next) => {
  const body = req.body;
  insertEvent(body)
    .then((event) => {
      res.status(201).send({ event });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUserToUserEvents = (req, res, next) => {
  const body = req.body;
  const event_id = req.params.event_id;

  const promises = [
    selectUserByUserId(body.user_id),
    checkEvent(event_id),
    insertUserToUserEvents(body.user_id, event_id),
  ];

  Promise.all(promises)
    .then((promises) => {
      res.status(201).send({ userEvent: promises[2] });
    })
    .catch(next);
};

exports.postGameToEventGames = (req, res, next) => {
  const body = req.body;
  const event_id = req.params.event_id;

  const promises = [
    selectGameByGameId(body.game_id),
    checkEvent(event_id),
    insertGameToEventGames(body.game_id, event_id),
  ];

  Promise.all(promises)
    .then((promises) => {
      res.status(201).send({ eventGame: promises[2] });
    })
    .catch(next);
};

exports.patchEvent = (req, res, next) => {
  const event_id = req.params.event_id;
  const body = req.body;

  updateEvent(event_id, body)
    .then((event) => {
      res.status(200).send({ event });
    })
    .catch((err) => next(err));
};

exports.getUsersByEventId = (req, res, next) => {
  const event_id = req.params.event_id;

  const promises = [
    selectEventByEventId(event_id),
    selectUsersByEventId(event_id),
  ];

  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({ users: promises[1] });
    })
    .catch(next);
};

exports.getGamesByEventId = (req, res, next) => {
  const event_id = req.params.event_id;

  const promises = [
    checkEvent(event_id),
    selectGamesByEventId(event_id),
  ];

  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({ games: promises[1] });
    })
    .catch(next);
};

exports.deleteEvent = (req, res, next) => {
  const event_id = req.params.event_id;
  removeEvent(event_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => next(err));
};
