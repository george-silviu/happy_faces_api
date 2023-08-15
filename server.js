const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1", //localhost
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "happy_face_db",
  },
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/signin", signin.handleSignIn(db, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleClarifaiApiCall(req, res);
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/**
 *  / --> GET = this is working
 * /signin --> POST =  success/fail
 * /register --> POST = user
 * /profile/:userId --> GET = user
 * /image --> PUT --> user
 */
