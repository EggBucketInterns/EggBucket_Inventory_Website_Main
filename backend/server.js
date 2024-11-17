const express = require("express")
const path = require("path")
const routes = require(path.join(__dirname, ".", "routes"))
const { initializeApp } = require("firebase/app")
const cors = require("cors")
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

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

// Increase payload limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Updated CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 3600
}))

app.use(express.static(path.join(__dirname, "build")))
app.use('/', routes)

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

// Create server with proper error handling and timeouts
const server = app.listen(3002, '0.0.0.0', () => {
  console.log("Server started on port 3002")
})

// Set timeout values
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 121000;   // Slightly higher than keepAliveTimeout

// Error handling
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
