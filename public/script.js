const socket = io("/");
const videogrid = document.getElementById("video-grid");
const rooms = document.getElementById("room-id-content");
const Name = document.getElementById("Name");
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});
const myvideo = document.createElement("video");
myvideo.muted = true;
async function startUserMedia() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    addVideoStream(myvideo, stream);
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
      console.log(userId);
    });
  } catch (error) {
    console.error("Error accessing user media: " + error);
  }
}

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  startUserMedia();
} else {
  console.error("getUserMedia is not supported in this browser");
}

// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   navigator.mediaDevices
//     .getUserMedia({ video: true, audio: true })
//     .then(function (stream) {

//     })
//     .catch(function (error) {
//       console.error("Error accessing user media: " + error);
//     });
// } else {
//   console.error("getUserMedia is not supported in this browser");
// }
// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: true,
//   })
//   .then((stream) => {

//   })
//   .catch((error) => {
//     console.error("Error accessing media devices:", error);
//   });
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    const item = document.createElement("li");
    item.textContent = `You: ${input.value}`;
    messages.appendChild(item);
    socket.emit("chat message", input.value);
    input.value = "";
  }
});
socket.on("receive", (data) => {
  const item = document.createElement("li");
  item.textContent = data.name + ": " + data.message;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
socket.on("user-joined", (name) => {
  const item = document.createElement("li");
  item.innerHTML = `${name} join the room.`;
  messages.appendChild(item);
});
socket.on("user-disconnected", (userId) => {
  console.log("User disconnected:\t" + userId);
});
rooms.innerHTML = rooms.innerHTML + Room_Id;
const user_name = prompt("Enter name");
Name.innerHTML += user_name;

myPeer.on("open", (id) => {
  socket.emit("new-user-join", user_name);
  socket.emit("join-room", Room_Id, id);
});
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videogrid.append(video);
}

//home page
