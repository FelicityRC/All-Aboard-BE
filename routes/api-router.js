const apiRouter = require("express").Router();
const userRouter = require("./users-router");

apiRouter.use("/users", userRouter);

module.exports = apiRouter;
