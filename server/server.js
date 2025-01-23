require("dotenv").config();
console.log(process.env.MONGO_URI);
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const notificationRoute = require("./routes/notificationRoute");
const projectRoute = require("./routes/projectRoute");
const stageRoute = require("./routes/stageRoute");
const taskRoute = require("./routes/taskRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const errorHandler = require("./middleware/errorMiddleware");
const initializeSocket = require("./socket/Socket");
// import the initializeSocket function
const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);
// Middlewares
app.use(express.json());

// Setup CORS middleware

// app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.options(
  "*",
  cors({
    origin: "*",
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/projects", projectRoute);
app.use("/api/stages", stageRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/dashboard", dashboardRoute);

// Error Handler
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const path = require("path");
__dirname = path.resolve();
// render deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

//Connect MongoDb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
