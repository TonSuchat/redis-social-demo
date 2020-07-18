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
    lrangeAsync: promisify(client.lrange).bind(client),
    hgetallAsync: promisify(client.hgetall).bind(client),
    zaddAsync: promisify(client.zadd).bind(client),
    zrankAsync: promisify(client.zrank).bind(client),
    zremAsync: promisify(client.zrem).bind(client),
    zcardAsync: promisify(client.zcard).bind(client),
  };
};

module.exports = initialRedisAsyncCommands;
