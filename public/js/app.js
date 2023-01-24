const socket = io();

const submitButton = document.getElementById("submit");

const enterForm = document.getElementById("enter-form");

const gameContainer = document.getElementById("game");

const display = document.getElementById("display");

const user1 = document.getElementById("user1");

const user2 = document.getElementById("user2");

const roomName = document.getElementById("roomName");

const updateRoomInfo = (response) => {
  roomName.innerText = response.roomName;
  user1.innerText = response.room[0].username;
  user2.innerText = response.room[1] ? response.room[1].username : "waiting...";
};

submitButton.onclick = () => {
  const usernameInput = document.getElementById("usernameInput");
  const roomNameInput = document.getElementById("roomNameInput");
  const payload = {
    username: usernameInput.value,
    roomName: roomNameInput.value,
  };

  socket.emit("enter", payload, (response) => {
    console.log("client side", response);
    if (response.success) {
      gameContainer.className = "grid-container";
      enterForm.className = "hidden";
      display.className = "display";
      updateRoomInfo(response);
    }
  });
  console.log("payload", payload);
};

socket.on("enter", (payload) => {
  console.log("room payload", payload);
});
