const express = require("express")
const path = require("path")
const routes = require(path.join(__dirname, ".", "routes"))
const { initializeApp } = require("firebase/app")
const cors = require("cors")
const cookieParser = require('cookie-parser');
const firebaseConfig = {
  apiKey: "AIzaSyCI8lZ8socew2H-JAmNmhnIisF-MBvMM5s",
  authDomain: "scannerapp-4448f.firebaseapp.com",
  projectId: "scannerapp-4448f",
  storageBucket: "scannerapp-4448f.appspot.com",
  messagingSenderId: "822303664619",
  appId: "1:822303664619:web:cca5457ac63e669f9e11ae",
  measurementId: "G-S4S64HK08Y"
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




