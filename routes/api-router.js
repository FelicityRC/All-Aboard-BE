const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const eventRouter = require("./events-router");

apiRouter.use("/users", userRouter);
apiRouter.use("/events", eventRouter);

const gameRouter = require("./games-router");


apiRouter.use("/games", gameRouter);


module.exports = apiRouter;
