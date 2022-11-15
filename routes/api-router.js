const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const eventRouter = require("./events-router");

apiRouter.use("/users", userRouter);
apiRouter.use("/events", eventRouter);

module.exports = apiRouter;
