const groupRouter = require("express").Router();

const {
  getGroups,
  getGroupByGroupId,
  getUsersByGroupId,
} = require("../controllers/groups.controllers");

groupRouter.get("/", getGroups);
groupRouter.get("/:group_id", getGroupByGroupId);
groupRouter.get("/:group_id/users", getUsersByGroupId);

module.exports = groupRouter;
