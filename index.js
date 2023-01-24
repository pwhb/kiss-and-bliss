const express = require("express");
const appRouter = require("./routers/app");
const configureSocket = require("./socket/configureSocket");

const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use("/", appRouter);
configureSocket(io);

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
