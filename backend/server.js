const express = require("express");
const cors = require("cors");
const msgpack = require("msgpack-lite");
const protobuf = require("protobufjs");

const app = express();
app.use(
  cors({
    exposedHeaders: ["X-Size", "X-Time"],
  })
);
let UserList;

// Load Protobuf schema
protobuf.load("user.proto").then((root) => {
  UserList = root.lookupType("UserList");
});

// Generate test data
const generateUsers = (count = 2000) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    email: `user${i}@test.com`,
    interests: ["coding", "music", "sports"],
    active: i % 2 === 0,
  }));
};

const users = generateUsers(2000);

// JSON Route
app.get("/json", (req, res) => {
  const start = process.hrtime.bigint();
  const json = JSON.stringify(users);
  const end = process.hrtime.bigint();

res.set({
  "Content-Type": "application/json",
  "X-Size": Buffer.byteLength(json).toString(),
  "X-Time": (Number(end - start) / 1e6).toFixed(2),
});

  res.send(json);
});

// MessagePack Route
app.get("/msgpack", (req, res) => {
  const start = process.hrtime.bigint();
  const encoded = msgpack.encode(users);
  const end = process.hrtime.bigint();

  res.set({
    "Content-Type": "application/octet-stream",
    "X-Size": encoded.length,
    "X-Time": Number(end - start) / 1e6,
  });

  res.send(encoded);
});

// Protobuf Route
app.get("/protobuf", (req, res) => {
  const payload = { users };
  const start = process.hrtime.bigint();

  const message = UserList.create(payload);
  const buffer = UserList.encode(message).finish();

  const end = process.hrtime.bigint();

  res.set({
    "Content-Type": "application/octet-stream",
    "X-Size": buffer.length,
    "X-Time": Number(end - start) / 1e6,
  });

  res.send(buffer);
});

app.listen(5000, () => console.log("Backend running on port 5000"));