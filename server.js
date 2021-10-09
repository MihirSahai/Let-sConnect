const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

// app.get("/vid", (req, res) => {
//     res.redirect(`/vid/${uuidV4()}`);
// });

// app.get("/vid/:room", (req, res) => {
//     res.render("room", { roomId: req.params.room });
// });

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId);
        });
    });
});

server.listen(port, function () {
    console.log("server is running on port " + port);
});

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/signup", function (req, res) {
    res.render("signup");
});