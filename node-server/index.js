const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A User Connected!!");
  socket.on("send-message", (obj) => {
    io.emit("receive-message", obj);
  });
});
