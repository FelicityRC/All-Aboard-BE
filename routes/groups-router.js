const groupRouter = require("express").Router();

const { getGroups } = require("../controllers/groups.controllers");

groupRouter.get("/", getGroups);

module.exports = groupRouter;
