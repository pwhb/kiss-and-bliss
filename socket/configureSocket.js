const score = {
  team1: 0,
  team2: 0,
  winner: "",
  scoredBy: "",
};

const prevState = {
  team1: 0,
  team2: 0,
  scoredBy: "",
};

const updateScore = (teamName, update) => {
  prevState.team1 = score.team1;
  prevState.team2 = score.team2;
  prevState.scoredBy = score.scoredBy;
  score[teamName] += update;
  score.scoredBy = teamName;

  // console.log({ score, prevState });
};

const undoScore = () => {
  score.team1 = prevState.team1;
  score.team2 = prevState.team2;
  score.scoredBy = prevState.scoredBy;
  score.winner = "";
};

const resetScore = () => {
  score.team1 = 0;
  score.team2 = 0;
  score.scoredBy = "";
  score.winner = "";
};

const rooms = {};

const removeFromRoom = (roomName, id) => {
  rooms[roomName] = rooms[roomName].filter((user) => user.id != id);
};

const enterRoom = (roomName, username, id) => {
  if (rooms[roomName]) {
    if (rooms[roomName][1]) {
      return { success: false };
    }
    rooms[roomName].push({ username, id });
  } else {
    rooms[roomName] = [{ username, id }];
  }
  return { success: true, room: rooms[roomName], roomName };
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    // socket.emit("update", score);

    socket.on("enter", ({ username, roomName }, callback) => {
      const res = enterRoom(roomName, username, socket.id);
      if (res.success) {
        socket.join(roomName);
        socket.roomName = roomName;
      }
      callback(res);
    });

    socket.on("disconnect", () => {
      console.log("disconnect roomName", socket.roomName);
      if (socket.roomName) {
        removeFromRoom(socket.roomName, socket.id);
      }
      console.log("disconnect id", socket.id); // undefined
    });

    socket.on("update", ({ teamName, update }) => {
      updateScore(teamName, update);
      io.emit("update", score);
    });

    socket.on("undo", () => {
      undoScore();
      io.emit("update", score);
    });

    socket.on("reset", () => {
      resetScore();
      io.emit("update", score);
    });
  });
};
