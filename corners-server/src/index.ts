import WebsocketServer from "./websocket/WebsocketServer";

process.title = "cornersServer";

const wsServer = WebsocketServer(8080);
wsServer.start();

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT");
  wsServer.stop();
  process.exit();
});

console.log("Corners server successfully started!");
