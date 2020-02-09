var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var redisConfig = require('../config/redis');
var redisClient = redis.createClient(redisConfig);


module.exports = {

    set: (key, value) => {
        redisClient.set(key, value, redis.print);
    },

    get: (key) => {
        redisClient.get(key,function (err, value){
            if(err){
                console.log(err);
            }
            else {
                return value;
            }
        })
    },

    del: (key) => {
        redisclient.del(key);
    }
}