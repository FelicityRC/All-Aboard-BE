const groupRouter = require("express").Router();

const {
  getGroups,
  getGroupByGroupId,
} = require("../controllers/groups.controllers");

groupRouter.get("/", getGroups);
groupRouter.get("/:group_id", getGroupByGroupId);

module.exports = groupRouter;
