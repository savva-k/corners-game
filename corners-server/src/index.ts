import WebsocketServer from "./websocket/WebsocketServer";
import express from "express";
import bodyParser from "body-parser";
import Knex from "knex";
import knexConfig from "./db/knexfile";
import * as dotenv from "dotenv";

dotenv.config();

const wsPort = 8080;
const httpPort = 8090;
process.title = "cornersServer";

const wsServer = WebsocketServer(wsPort);
wsServer.start();

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// const knex = Knex(knexConfig.development);
// knex.on("query", console.log);

app.listen(httpPort, () => {
  console.log(`REST service is listening on ${httpPort}`);
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT");
  wsServer.stop();
  process.exit();
});

console.log("Corners server successfully started!");
