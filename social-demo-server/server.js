require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { promisify } = require("util");
const redis = require("redis");

const getRedisAsyncCommands = require("./redisCommands");
const { authRoutes: setupAuthRoutes } = require("./routes/auth");
const setupActionRoutes = require("./routes/action");

const client = redis.createClient();
const redisAsyncCommands = getRedisAsyncCommands(client);

const port = process.env.PORT || 5000;

client.on("error", () => console.log(error));

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

setupAuthRoutes(app, redisAsyncCommands);
setupActionRoutes(app, redisAsyncCommands);

app.use((err, _req, res, _next) => {
  if (res.statusCode === 200) res.status(500);
  res.send(err.message);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
