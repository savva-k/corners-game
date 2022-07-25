import WebsocketServer from "./websocket/WebsocketServer";
import express from "express";
import bodyParser from "body-parser";
import Knex from "knex";
import knexConfig from "./db/knexfile";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

const knex = Knex(knexConfig.development);
knex.on("query", console.log);

const getUserByLogin = (login: string) => {
  return knex("users")
    .select("id", "name", "password")
    .where("name", login)
    .first();
};

app.post("/login", (req, res) => {
  const { login, password } = req.body;

  return getUserByLogin(login).then((user) => {
    if (user) {
      return bcrypt.compare(password, user.password).then((success) => {
        if (success) {
          return res.json({
            token: jwt.sign({ user: user.name }, process.env.TOKEN_SECRET),
          });
        }
        return res.sendStatus(401);
      });
    }
    return res.sendStatus(401);
  });
});

app.post("/register", (req, res) => {
  const { login, email, password } = req.body;

  return getUserByLogin(login).then((user) => {
    if (!user) {
      return bcrypt.hash(password, 10).then((hash) => {
        console.log("saving");
        console.log({ name: login, email: email, password: hash });
        return knex("users")
          .insert({ name: login, email: email, password: hash })
          .then(() => {
            return res.sendStatus(200);
          })
          .catch((err) => {
            console.error(err);
            return res.sendStatus(500);
          });
      });
    }
    return res.sendStatus(400);
  });
});

app.listen(httpPort, () => {
  console.log(`REST service is listening on ${httpPort}`);
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT");
  wsServer.stop();
  process.exit();
});

console.log("Corners server successfully started!");
