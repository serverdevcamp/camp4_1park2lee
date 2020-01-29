const db_config = require('../db-config.json')
const redis = require('redis')

const redisClient = redis.createClient(db_config.redis);


function incrCount(id){
    // redisClient.incr(id);
    redisClient.zadd("words", 'INCR',1,id);
}

module.exports = {
    redisClient : redisClient,
    incrCount : incrCount,
  };