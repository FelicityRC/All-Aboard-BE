const {
  selectGroups,
  selectGroupByGroupId,
  selectUsersByGroupId,
  insertUserToUserGroups
} = require("../models/groups.models");
const { selectUserByUserId } = require("../models/users.models");

exports.getGroups = (req, res, next) => {
  selectGroups().then((groups) => {
    res.status(200).send({ groups });
  });
};

exports.getGroupByGroupId = (req, res, next) => {
  const groupId = req.params.group_id;

  selectGroupByGroupId(groupId)
    .then((group) => {
      res.status(200).send({ group });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersByGroupId = (req, res, next) => {
  const groupId = req.params.group_id;

  selectUsersByGroupId(groupId)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUserToUserGroups = (req, res, next) => {
  const body = req.body;
  const group_id = req.params.group_id;

  const promises = [
    selectUserByUserId(body.user_id),
    selectGroupByGroupId(group_id),
    insertUserToUserGroups(body.user_id, group_id)
  ]

  Promise.all(promises)
    .then((promises) => {
      res.status(201).send({userGroup: promises[2]})
    }).catch(next);
}
