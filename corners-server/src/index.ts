import WebsocketServer from "./websocket/WebsocketServer";
import express from "express";

const wsPort = 8080;
const httpPort = 8090;
process.title = "cornersServer";

const wsServer = WebsocketServer(wsPort);
wsServer.start();

const app = express();

app.get("/login", (reg, res) => {
  res.json("There will be some nice login feature one day");
});

app.listen(httpPort, () => {
  console.log(`REST service is listening on ${httpPort}`)
})

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT");
  wsServer.stop();
  process.exit();
});

console.log("Corners server successfully started!");
