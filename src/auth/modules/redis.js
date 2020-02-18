var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var redisConfig = require('../config/redis');
var redisClient = redis.createClient(redisConfig);


module.exports = {

    getRedisClient: () => {
        return redisClient;
    },

    set: (key, value) => {
        redisClient.set(key, value, redis.print);
    },

    get: async (key) => {
        console.log(key);
        redisClient.get(key, async function (err, value){
            if(err){
                console.log(err);
                return undefined;
            }
            else {
                console.log("getvalue!",value);
                return await value;
            }
        })
    },

    del: (key) => {
        redisClient.del(key);
    }
}