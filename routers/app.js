const { Router } = require("express");

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

module.exports = appRouter;
