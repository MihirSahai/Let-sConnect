const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect(`/${uuidV4()}`);
});



io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        //socket.to(roomId).broadcast.emit("user-connected", userId);
        socket.broadcast.to(roomId).emit("user-connected", userId);
        socket.on("disconnect", () => {
            //socket.to(roomId).broadcast.emit("user-disconnected", userId);
            socket.broadcast.to(roomId).emit("user-disconnected", userId);
        });
    });
});

server.listen(port, function () {
    console.log("server is running on port " + port);
});

app.get("/home", function (req, res) {
    res.render("index");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});

app.post("/login", function (req, res) {
    //console.log(req.body.email);
    if(req.body.email == "admin@jss.426" && req.body.pass =="123"){
        res.redirect("/");
    }
})