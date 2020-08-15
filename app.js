var express = require("express");
var chalk = require("chalk");
var debug = require("debug")("app")
var morgan = require("morgan")
var app = express();

app.use(morgan("tiny"))
app.get("/", (req, res) => {
    res.send("My test")
})

app.listen(3000, () => {
    debug(`successfully created app at: ${chalk.green("http://localhost:3000")}`) 
})