const eventRouter = require("express").Router();

const { getEvents } = require("../controllers/events.controllers");
const eventRouter = require("./events-router");

eventRouter.get("/", getEvents);

module.exports = eventRouter;
