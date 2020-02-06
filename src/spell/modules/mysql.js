const mysql = require('mysql2');
const db_config = require('../config/db-config.json')

const fastJson = require('fast-json-stable-stringify'); // instead of JSON.stringify()

let redis = require('../modules/redis');

let pool = mysql.createPool(db_config.mysql);

function responseRank(callback) {
  redis.redisClient.get('latest_id', function (err, reply) {
    if (reply == undefined) callback(undefined)
    else if (!err) {
      pool.getConnection(function (err, connection) {
        if (!err) {
          connection.query("SELECT * FROM word_rank WHERE id = ?", reply, function (err, rows, fields) {
            if (!err) {
              callback(rows[0]['rank_json']);
            } else {
              console.log('Error while performing Query[SELECT].', err);
              callback(undefined);
            }
          });
          connection.release();
        }

      });
    }
  });
}

function responseUserRank(uId, limit, callback) {
  let responseData = new Object();

  pool.getConnection(function (err, connection) {
    if (!err) {
      connection.query("SELECT count, original, checked FROM user_word JOIN words ON user_word.word_id = words.id WHERE user_id = ? ORDER BY count DESC LIMIT ?", [uId, limit], function (err, rows, fields) {
        if (!err) {
          responseData['rank_cnt'] = rows.length;
          responseData['user_id'] = uId;

          for (let i = 1; i <= rows.length; i++) {
            let innerData = {
              cnt: rows[i - 1]['count'],
              wrong: rows[i - 1]['original'],
              correct: rows[i - 1]['checked']
            };
            responseData[i] = innerData;
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
      console.log(err)
      return;
    } else if (reply.length > 0) {
      pool.getConnection(function (err, connection) {
        if (!err) {
          /* ERASE THIS LINE
          redis.redisClient.multi()
            .del('words').exec_atomic(function (err, reply) {
              if (err)
                console.log(err);
            });*/
          let recurQuery = function (err, row, fields) {
            if (!err) {

              let innerData = {
                cnt: reply[(i * 2) + 1],
                wrong: row[0]['original'],
                correct: row[0]['checked']
              }
              container[i + 1] = innerData;

              i++;

              if (i < reply.length / 2)
                connection.query("SELECT * FROM words WHERE id = ?", reply[i * 2], recurQuery);
              else {
                let jsonData = fastJson(container);

                connection.query("INSERT INTO word_rank(rank_json) VALUES(?)", jsonData, function (err, res) {
                  if (err) console.log(err);

                  redis.redisClient.multi().del('latest_id').set('latest_id', res['insertId']).exec_atomic(function (err, reply) {
                    if (err) console.log(err);
                  });
                  connection.release();
                });

              }
            } else console.log('Error while performing Query.', err);

          }

          var i = 0;
          var container = new Object();
          container['rank_cnt'] = reply.length / 2;
          connection.query("SELECT * FROM words WHERE id = ?", reply[i * 2], recurQuery);

        } else {
          console.log(err);
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
  let rId;

  pool.getConnection(function (err, connection) {
    if (!err) {

      redis.checkWord(data, function (err, reply) {
        if (!err) {
          if (reply != undefined) {
            rId = reply;
          } else {

            connection.query("SELECT id FROM words WHERE original = ? AND checked = ?", data, function (err, rows, fields) {
              if (!err) {
                if (rows.length > 0) {

                  rId = rows[0]['id'];
                  redis.cachingWord(data, rId);

                } else {
                  connection.query("INSERT INTO words(original, checked) Values (?)", [data], function (err, row, fields) {
                    if (err)
                      console.log('Error while performing Query[INSERT].', err);
                  });
                }
              } else
                console.log('Error while performing Query[SELECT].', err);

            });
          }
          rId = reply;
          redis.incrCount(rId);
          if (rId != undefined && uId != undefined)
            saveUserWords(uId, rId, connection);
          else
            connection.release();
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