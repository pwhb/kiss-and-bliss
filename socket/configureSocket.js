

const rooms = {};

const removeFromRoom = (roomName, id) => {
  rooms[roomName] = rooms[roomName].filter((user) => user.id != id);
};

const enterRoom = (roomName, username, id) => {
  if (rooms[roomName]) {
    if (rooms[roomName][1]) {
      return false
    }
    rooms[roomName].push({ username, id });
  } else {
    rooms[roomName] = [{ username, id }];
  }
  return true
};

const emitRoomInfo = (io, roomName) => {
  io.to(roomName).emit("roomInfo", { roomName, members: rooms[roomName] })
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    // socket.emit("update", score);

    socket.on("enter", ({ username, roomName }, callback) => {
      socket.username = username
      const res = enterRoom(roomName, username, socket.id);
      if (res) {
        socket.join(roomName);
        socket.roomName = roomName;
        emitRoomInfo(io, roomName)
        // io.to(roomName).emit("roomInfo", res.room)
      }

      callback(res);
    });

    socket.on("kiss", (kiss) => {
      const roomName = socket.roomName
      const username = socket.username
      rooms[roomName] = rooms[roomName].map((member) => {
        if (member.username === username) {
          return {
            ...member,
            kiss
          }
        }
        return member
      })
      console.log("kiss", { roomName, username, kiss, room: rooms[roomName] })
      io.to(roomName).emit("roomInfo", { roomName, members: rooms[roomName] })
    })

    socket.on("disconnect", () => {
      const roomName = socket.roomName
      if (roomName) {
        removeFromRoom(socket.roomName, socket.id);
        console.log("rooms", rooms)
        // io.to(roomName).emit("roomInfo", { roomName, members: room })
        emitRoomInfo(io, roomName)
      }
    });
  });
};
