const {
  selectUsers,
  selectUserByUserId,
  insertUser,
  updateUser,
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

  updateUser(user_id, body)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => next(err));
};
