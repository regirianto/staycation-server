const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");

const indexRouter = require("./app/routes/index");
const dashboardRouter = require("./app/routes/dashboard");
const categoryRouter = require("./app/routes/category");
const featuredRouter = require("./app/routes/featured");
const bankRouter = require("./app/routes/bank");
const itemRouter = require("./app/routes/item");
const bookingRouter = require("./app/routes/booking");
const authRouter = require("./app/routes/auth");
const isLogin = require("./app/middleware/auth");
const apiRoutes = require("./app/routes/api");

const app = express();
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(cors());
app.use(flash());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);

//API
const URL = "/api/v1/";
app.use(URL, apiRoutes);

app.use("/", authRouter);
app.use(isLogin);
app.use("/dashboard", dashboardRouter);
app.use("/category", categoryRouter);
app.use("/featured", featuredRouter);
app.use("/bank", bankRouter);
app.use("/item", itemRouter);
app.use("/booking", bookingRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
