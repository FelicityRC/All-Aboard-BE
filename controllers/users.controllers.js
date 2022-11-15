const {
  selectUsers,
  selectUserByUserId,
  insertUser,
} = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUserId = (req, res, next) => {
  const userId = req.params.user_id;

  selectUserByUserId(userId)
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
