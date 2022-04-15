const serverless = require("serverless-http");
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require('cors');
const port = process.env.PORT || 5001
require('dotenv/config');
app.use(cors())

mongoose.connect(process.env.DB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use('/', require('./routes'))

app.get("/ping", (req, res, next) => {
    return res.status(200).json({
      message: "Hello from CITI!",
    });
  });
  
  app.use((req, res, next) => {
    return res.status(404).json({
      error: "Not Found",
    });
  });

app.listen(port, () => console.log("server listening on " + port));

module.exports.handler = serverless(app, { callbackWaitsForEmptyEventLoop: false });
