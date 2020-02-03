const db_config = require('../config/db-config.json')

const redis = require('redis')
const redisClient = redis.createClient(db_config.redis);


function incrCount(id) {
    if (id != undefined)
        redisClient.zadd("words", 'INCR', 1, id);
}

function checkWord(data, callback) {
    let key = data[0] + ':' + data[1];
    redisClient.get(key, function (err, reply) {
        callback(err, reply);
    });
}

function cachingWord(data, id) {
    let key = data[0] + ':' + data[1];
    redisClient.set(key, id, 'EX', 60 * 5, function (err, reply) {
        if (err) console.log(err);
    })

}

module.exports = {
    redisClient: redisClient,
    incrCount: incrCount,
    checkWord: checkWord,
    cachingWord: cachingWord
};