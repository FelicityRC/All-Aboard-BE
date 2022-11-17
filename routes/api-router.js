const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const eventRouter = require("./events-router");
const gameRouter = require("./games-router");
const groupRouter = require("./groups-router");
const { getApi } = require("../controllers/api.controllers");

apiRouter.get("/", getApi);
apiRouter.use("/users", userRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/games", gameRouter);
apiRouter.use("/groups", groupRouter);

module.exports = apiRouter;
