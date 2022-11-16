const { selectGroups } = require("../models/groups.models");

exports.getGroups = (req, res, next) => {
  selectGroups().then((groups) => {
    res.status(200).send({ groups });
  });
};
