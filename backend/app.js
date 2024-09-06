const express = require("express")
const path = require("path")
const routes = require(path.join(__dirname, ".", "routes"))
const { initializeApp } = require("firebase/app")
const cors = require("cors")
const cookieParser = require('cookie-parser');
const firebaseConfig = {
  apiKey: "AIzaSyDjlkW8nBfaNCu2kVOHg0XqxMQ64DvdsUI",
  authDomain: "eb-workplace.firebaseapp.com",
  projectId: "eb-workplace",
  storageBucket: "eb-workplace.appspot.com",
  messagingSenderId: "859122737109",
  appId: "1:859122737109:web:cb25b1ab262cbda600275c",
  measurementId: "G-789F43P0MN"
};

const app = express()
const cloud = initializeApp(firebaseConfig);

app.use(cookieParser());
app.use(cors({
  "origin": ["*"],
  "method": ["GET", "POST"],
  "maxAgeSeconds": 3600
}))
app.use(express.json())
app.use(express.static(path.join(__dirname, "..", "frontend", "build")))
app.use('/', routes)

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(3000, () => {
  console.log("Server started on port 3000")
})




