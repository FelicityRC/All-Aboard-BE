const { selectApi } = require("../models/api.models");

exports.getApi = (req, res, next) => {
  selectApi().then((api) => {
    res.status(200).send({ api });
  });
};
