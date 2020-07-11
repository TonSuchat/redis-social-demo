require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { promisify } = require("util");
const redis = require("redis");

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

const port = process.env.PORT || 5000;

client.on("error", () => console.log(error));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const fooValue = await getAsync("foo");
  res.json({ message: fooValue });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
