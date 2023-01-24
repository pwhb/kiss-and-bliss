const socket = io();

const submitButton = document.getElementById("submit");

const enterForm = document.getElementById("enter-form");

const gameContainer = document.getElementById("game");

const display = document.getElementById("display");

const user1 = document.getElementById("user1");

const user2 = document.getElementById("user2");

const player1 = document.getElementById("player1");

const player2 = document.getElementById("player2");

const roomName = document.getElementById("roomName");

const kissButton = document.getElementById("kissButton")

const updateRoomInfo = (response) => {
  console.log(response)
  roomName.innerText = response.roomName;
  user1.innerText = response.members[0].username;
  user2.innerText = response.members[1] ? response.members[1].username : "waiting...";

  player1.className = response.members[0].kiss ? "icon left" : "icon right"
  player1.src = response.members[0].kiss ? "/svg/kiss.svg" : "/svg/smile.svg"
  player2.className = response.members[1]?.kiss ? "icon right" : "icon left"
  player2.src = response.members[1].kiss ? "/svg/kiss.svg" : "/svg/smile.svg"
};


const emitKiss = (kiss) => {
  kissButton.className = kiss ? "kissing" : ""
  socket.emit("kiss", kiss)
}

submitButton.onclick = () => {
  const usernameInput = document.getElementById("usernameInput");
  const roomNameInput = document.getElementById("roomNameInput");
  const payload = {
    username: usernameInput.value,
    roomName: roomNameInput.value,
  };

  socket.emit("enter", payload, (response) => {
    if (response) {
      gameContainer.className = "grid-container";
      enterForm.className = "hidden";
      display.className = "display";
    }
  });
};

kissButton.onmousedown = () => {
  console.log("onmousedown")
  emitKiss(true)
}

kissButton.onmouseup = () => {
  console.log("onmouseup");
  emitKiss(false)
}

kissButton.ontouchstart = () => {
  console.log("ontouchstart")
  emitKiss(true)
}

kissButton.ontouchend = () => {
  console.log("ontouchend")
  emitKiss(false)
}

socket.on("roomInfo", (room) => {
  updateRoomInfo(room);
});
