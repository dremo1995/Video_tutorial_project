const express = require("express");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const logger = require("morgan");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const colors = require("colors");
const path = require("path");
const connectDB = require("./config/db");
const app = express();
const strategy = require("./middlewares/strategy");
const flashConfig = require("./middlewares/flashConfig");
// Import Routes files
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");

// Environment variables
dotenv.config({ path: "./config/config.env" });
// Configure the server PORT
const port = process.env.PORT;
// Connect to DB
connectDB();

// Setup Template Engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    partialsDir: path.join(__dirname, "views", "partials"),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");

// setting up the session storage in DB
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
  expires: 1000 * 60 * 60, //
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

// Custom middleware
app.use(strategy);
app.use(flashConfig);

// Middlewares
app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: false }));

// Setup the logger
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// load the routes
app.use(courseRoutes);
app.use(authRoutes);

// load page not found
app.use((req, res) => {
  res.render("404.hbs");
});

app.use((error, req, res, next) => {
  res.render("500.hbs", { error });
});

const server = app.listen(
  port,
  console.log(`server running on port ${process.env.PORT} ...`.yellow.underline)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(err);
  console.log(`Error:${err}`.red);
  server.close(() => {
    console.log(`Server has been stopped...`.red.underline);
    process.exit(1);
  });
});
