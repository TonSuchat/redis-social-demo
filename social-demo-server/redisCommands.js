const { promisify } = require("util");

const initialRedisAsyncCommands = (client) => {
  return {
    getAsync: promisify(client.get).bind(client),
    hgetAsync: promisify(client.hget).bind(client),
    hsetAsync: promisify(client.hset).bind(client),
    hmsetAsync: promisify(client.hmset).bind(client),
    incrAsync: promisify(client.incr).bind(client),
    zrangeAsync: promisify(client.zrange).bind(client),
    lpushAsync: promisify(client.lpush).bind(client),
    ltrimAsync: promisify(client.ltrim).bind(client),
  };
};

module.exports = initialRedisAsyncCommands;
