import express from "express"
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import load from "express-load"
import cors from "cors"
import config from "./config/config.js"
import mongoose from "mongoose"

let conection = mongoose.connect(config.db, { useNewUrlParser: true })
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'))
db.on("open", () => console.log("Connected with DB."))

const app = express()
app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "views"))
app.engine("html", require("ejs").renderFile)
app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

load("models")
  .then("controllers")
  .then("routes")
  .into(app);

app.get(["*"], (req, res) => res.render("index.html"))

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.use((req, res, next) => {
  let err = new Error("Not Found")
  err.status = 404
  next(err)
});

if (app.get("env") === "development") {
  app.use((err, req, res) => {
    res.status(err.status || 500)
    res.json({ status: "NOT_FOUND", error: err.message })
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500)
  res.json({ status: "NOT_FOUND", error: err.message })
})

module.exports = app;
