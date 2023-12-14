import http from "http";
import { WebSocketServer, WebSocket } from "ws";

import url from "url";
import { v4 as uuidv4 } from "uuid";

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

interface User {
  username: string;
  state: Record<string, any>;
}

const connections: Record<string, WebSocket> = {};
const users: Record<string, User> = {};

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessage = (bytes: Buffer, uuid: string) => {
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];
  user.state = message;

  broadcast();

  console.log(
    `${user.username} updated their state: ${JSON.stringify(user.state)}`
  );
};

const handleClose = (uuid: string) => {
  delete connections[uuid];
  delete users[uuid];

  broadcast();
};

wsServer.on("connection", (connection: WebSocket, request) => {
  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();
  console.log(username);
  console.log(uuid);

  connections[uuid] = connection;

  users[uuid] = {
    username: username as string,
    state: {},
  };

  connection.on("message", (message) => handleMessage(message as Buffer, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
