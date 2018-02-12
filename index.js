import express from "express";
import bodyParser from "body-parser";
import redis from "redis";
import routes from "./src/routes";
import client from "./client";

var app = express();

export default client;

client.on("error", err => {
  console.log("Error " + err);
});

client.on("ready", () => {
  console.log("Redis successfully setup");
});

app.set("port", process.env.PORT || 8080);
const PORT = app.get("port");

//bodyParser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(`Node and express server running on PORT ${PORT}`);
});

routes(app);

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
