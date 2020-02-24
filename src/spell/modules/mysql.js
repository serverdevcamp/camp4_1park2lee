const config = require('../../hunmin-config');
const path = require('path');

const mysql = require('mysql2');
const db_config = require(path.join(config.CONFIG_PATH, "mysql-spell.json"))[config.NODE_ENV];

const fastJson = require('fast-json-stable-stringify'); // instead of JSON.stringify()

let redis = require('../modules/redis');

let pool = mysql.createPool(db_config.mysql);

function responseRank(callback) {
    redis.redisClient.get('latest_rank', function (err, reply) {
        if (!err) {
            if (reply) {
                callback(reply);
                return;
            }
            pool.getConnection(function (err, connection) {
                if (!err) {
                    connection.query("SELECT * FROM word_rank ORDER BY id LIMIT 1", function (err, rows, fields) {
                        if (!err && rows.length > 0) {
                            redis.redisClient.set('latest_rank', rows[0]['rank_json']);
                            callback(rows[0]['rank_json']);
                        } else {
                            callback(undefined);
                        }
                    });
                    connection.release();
                }

            });
        } else {
            callback(undefined);
        }
    });
}

function responseUserRank(uId, limit, callback) {
    let responseData = {};

    pool.getConnection(function (err, connection) {
        console.log('pool');
        if (!err) {
            connection.query("SELECT count, original, checked " +
                "FROM user_word JOIN words ON user_word.word_id = words.id " +
                "WHERE user_id = ? ORDER BY count DESC LIMIT ?", [uId, limit], function (err, rows, fields) {
                if (!err) {
                    responseData['rank_cnt'] = rows.length;
                    responseData['user_id'] = uId;

                    for (let i = 1; i <= rows.length; i++) {
                        responseData[i] = {
                            cnt: rows[i - 1]['count'],
                            wrong: rows[i - 1]['original'],
                            correct: rows[i - 1]['checked']
                        };
                    }

                } else
                    responseData['rank_cnt'] = -1;
                callback(responseData);
            });
            connection.release();
        }
    });
}

function calcWordRank(cnt) {
    redis.redisClient.ZREVRANGE("words", 0, cnt - 1, 'WITHSCORES', function (err, reply) {
        if (err) {
            console.log(err);

        } else if (reply.length > 0) {
            pool.getConnection(function (err, connection) {

                if (!err) {
                    redis.redisClient.multi()
                        .del('words').exec_atomic(function (err, reply) {
                        if (err)
                            console.log(err);
                    });

                    let recurQuery = function (err, row, fields) {
                        if (row.length > 0) {

                            container[i + 1] = {
                                cnt: reply[(i * 2) + 1],
                                wrong: row[0]['original'],
                                correct: row[0]['checked']
                            };

                            i++;

                            if (i < reply.length / 2)
                                connection.query("SELECT * FROM words WHERE id = ?", reply[i * 2], recurQuery);
                            else {
                                let jsonData = fastJson(container);

                                connection.query("INSERT INTO word_rank(rank_json) VALUES(?)", jsonData, function (err, res) {
                                    if (err) console.log(err);

                                    redis.redisClient.multi().del('latest_rank').set('latest_rank', jsonData).exec_atomic(function (err, reply) {
                                        if (err) console.log(err);
                                    });
                                    connection.release();
                                });

                            }
                        } else if (err) {
                            console.log('Error while performing Query.', err);
                            connection.release();
                        }

                    };

                    let i = 0;
                    let container = {};
                    container['rank_cnt'] = reply.length / 2;
                    connection.query("SELECT * FROM words WHERE id = ?", reply[i * 2], recurQuery);

                } else {
                    console.log(err);
                    connection.release();
                }

            });
        }
    });

}

function saveUserWords(uId, wId, connection) {
    let data = [uId, wId];
    connection.query("INSERT INTO user_word(user_id, word_id) Values (?) ON DUPLICATE KEY UPDATE count = count + 1", [data], function (err, row, fields) {
        if (err) console.log('Error while performing Query.', err);
        connection.release();
    });
}

function getWords(data, uId) {

    let incrWord = (wId, uId, connection, isCaching = false, data = null) => {
        if (isCaching) redis.cachingWord(data, wId);
        redis.incrCount(wId);

        if (typeof wId != "undefined" && typeof uId != "undefined")
            saveUserWords(uId, wId, connection);
        else
            connection.release();
    };

    pool.getConnection(function (err, connection) {
        if (!err) {

            redis.checkWord(data, function (err, reply) {
                if (!err) {
                    if (reply) incrWord(reply, uId, connection);
                    else {
                        connection.query("SELECT id FROM words WHERE original = ? AND checked = ?", data, function (err, rows, fields) {
                            if (!err) {
                                if (rows.length > 0) {
                                    incrWord(rows[0]['id'], uId, connection, true, data)
                                } else {
                                    connection.query("INSERT IGNORE INTO words(original, checked) Values (?)", [data], function (err, row, fields) {
                                        if (err)
                                            console.log('Error while performing Query[INSERT].', err);
                                        else {
                                            incrWord(row['insertId'], uId, connection, true, data);
                                        }
                                    });
                                }
                            } else console.log('Error while performing Query[SELECT].', err);

                        });
                    }
                } else {
                    console.log('getWords: ', err);
                }

            });

        }
    });
}

module.exports = {
    getWords: getWords,
    calcWordRank: calcWordRank,
    responseRank: responseRank,
    responseUserRank: responseUserRank,
};