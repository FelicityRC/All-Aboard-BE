const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const gameRouter = require("./games-router");

apiRouter.use("/users", userRouter);
apiRouter.use("/games", gameRouter);

module.exports = apiRouter;
