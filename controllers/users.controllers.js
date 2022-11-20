const {
  selectUsers,
  selectUserByUserId,
  insertUser,
  updateUser,
  selectGamesByUserId,
  selectEventsByUserId,
} = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUserId = (req, res, next) => {
  const user_id = req.params.user_id;

  selectUserByUserId(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => next(err));
};

exports.postUser = (req, res, next) => {
  const body = req.body;
  insertUser(body)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => next(err));
};

exports.patchUser = (req, res, next) => {
  const user_id = req.params.user_id;
  const body = req.body;

  const promises = [
    selectUserByUserId(user_id),
    updateUser(user_id, body)
  ]

  Promise.all(promises).then((promises) => {
    res.status(200).send({user: promises[1]})
  }).catch((err) => next(err))
};

exports.getGamesByUserId = (req, res, next) => {
  const user_id = req.params.user_id;

  const promises = [
    selectUserByUserId(user_id),
    selectGamesByUserId(user_id)
  ]

  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({games: promises[1]})
    }).catch(next);
};

exports.getEventsByUserId = (req, res, next) => {
  const user_id = req.params.user_id;

  selectEventsByUserId(user_id)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch((err) => next(err));
};
