const groupRouter = require("express").Router();

const {
  getGroups,
  getGroupByGroupId,
  getUsersByGroupId,
  postUserToUserGroups,
} = require("../controllers/groups.controllers");

groupRouter.get("/", getGroups);
groupRouter.get("/:group_id", getGroupByGroupId);

groupRouter
.route("/:group_id/users")
.get(getUsersByGroupId)
.post(postUserToUserGroups)

module.exports = groupRouter;
