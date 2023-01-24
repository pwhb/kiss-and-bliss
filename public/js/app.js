const socket = io();

const submitButton = document.getElementById("submit");

submitButton.onclick = () => {
  const usernameInput = document.getElementById("username");
  const roomNameInput = document.getElementById("roomName");
  const payload = {
    username: usernameInput.value,
    roomName: roomNameInput.value,
  };

  socket.emit("enter", payload, (response) => {
    console.log("client side", response);
  });
  console.log("payload", payload);
};

socket.on("enter", (payload) => {
  console.log("room payload", payload);
});
