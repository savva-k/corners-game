import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:32322",
  realm: "corners-game",
  clientId: "frontend",
});

export default keycloak;
