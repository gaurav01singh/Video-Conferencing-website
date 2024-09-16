const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./model/user");

mongoose.connect("mongodb+srv://Gaurav:gaurav.1290@cluster0.yicvjtb.mongodb.net/");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});
app.post("/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
  });

  return res.status(200).json(user);
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.post("/login", async function (req, res) {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = req.body.password === user.password;
      if (result) {
        res.redirect("/secret");
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
app.get("/secret", (req, res) => {
  res.render("secret");
});

app.get("/room34", (req, res) => {
  // Generate a UUID using uuidV4() function
  const roomUUID = uuidV4();
  res.redirect("/" + roomUUID);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});
const users = {};
io.on("connection", (socket) => {
  socket.on("new-user-join", (name) => {
    console.log(name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
  socket.on("chat message", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
});

server.listen(8000, () => {
  console.log(`server is listening at http://localhost:${8000}`);
});

//registration
app.use(bodyparser.json());
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  res.json({ static: "ok" });
});
