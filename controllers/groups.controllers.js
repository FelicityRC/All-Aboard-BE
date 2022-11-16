const {
  selectGroups,
  selectGroupByGroupId,
} = require("../models/groups.models");

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
