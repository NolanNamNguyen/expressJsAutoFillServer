const functions = require("firebase-functions");
// eslint-disable-next-line no-unused-vars
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({origin: true}));

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World!");
});

exports.app = functions.https.onRequest(app);