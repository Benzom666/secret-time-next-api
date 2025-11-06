const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const winston = require("winston");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const promotionRouter = require("./routes/promotion");
const datesRouter = require("./routes/date");
const filesRouter = require("./routes/files");
const countryRouter = require("./routes/country");
const requestRouter = require("./routes/request");
const chatRouter = require("./routes/chat");
const defaultMessageRouter = require("./routes/default-messages");
const defaultInfluencerRouter = require("./routes/influencer");
const dashboardRouter = require("./routes/dashboard");
const categoryRouter = require("./routes/category");
const aspirationRouter = require("./routes/aspiration");
const notificationRouter = require("./routes/notification");
const cron = require("node-cron");
const chatController = require("./controllers/v1/chat.js");

const winstonLog = require("./config/winston");

require("./lib/env");

global.BASEDIR = __dirname;

const app = express();

// CORS
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "*,authorization,Origin, X-Requested-With, Content-Type, Accept"
    ); // "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.options("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
});

if (process.env !== "PRODUCTION") {
    winstonLog.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

mongoose.Promise = global.Promise;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => winstonLog.info("connection successful"))
    .catch((err) => winstonLog.info(err));
mongoose.set("debug", true);

const db = mongoose.connection;
db.on("error", winston.error.bind(winston, "connection error: "));
db.once("open", () => {
    winston.info("Connected to Mongo DB");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/", indexRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/date", datesRouter);
app.use("/api/v1/files", filesRouter);
app.use("/api/v1/country", countryRouter);
app.use("/api/v1/request", requestRouter);
app.use("/api/v1/promotion", promotionRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/defaultMessage", defaultMessageRouter);
app.use("/api/v1/influencer", defaultInfluencerRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/aspirations", aspirationRouter);

cron.schedule("* * * * *", function () {
    console.log("running a task every minute");
    chatController.handleCron();
});
// chatController.handleCron();

// catch 404 and forward to error handler
app.all("*", (req, res) => {
    res.status(404).json({
        status: 404,
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});

// error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

module.exports = app;
