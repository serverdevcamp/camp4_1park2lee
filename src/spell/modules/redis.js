const db_config = require('../db-config.json')
const redis = require('redis')

const redisClient = redis.createClient(db_config.redis);

function incrCount(id){
    // redisClient.incr(id);
    redisClient.zadd("words", 'INCR',1,id);
}

function getCount(){
    redisClient.ZREVRANGE("words", 0, 2, 'WITHSCORES', function(err, reply){
        if(err){
            console.log("error");
            return;
        }
        else
        {
          console.log(reply);
        }
    });
}

module.exports = {
    redisClient : redisClient,
    incrCount : incrCount,
    getCount : getCount,
  };