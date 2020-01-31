let mysql = require('mysql');

const db_config = require('../db-config.json')
let pool = mysql.createPool(db_config.mysql);

let redis = require('../modules/redis');


function responseRank(callback) {
  redis.redisClient.get('latest_id', function (err, reply) {
    if (!err) {
      pool.getConnection(function (err, connection) {
        if (!err) {
          connection.query("SELECT * FROM word_rank WHERE id = ?", reply, function (err, rows, fields) {
            if (!err) {
              callback(rows[0]['rank_json']);
            } else
              console.log('Error while performing Query[SELECT].', err);
          });
          connection.release();
        }

      });
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
          // redis.redisClient.multi()
          //   .del('words').exec_atomic(function (err, reply) {
          //     if (err)
          //       console.log(err);
          //   });
          var recurQuery = function (err, row, fields) {
            if (!err) {

              var inner_data = {
                cnt: reply[(i * 2) + 1],
                wrong: row[0]['original'],
                correct: row[0]['checked']
              }
              container[i + 1] = inner_data;

              i++;

              if (i < reply.length / 2)
                connection.query("SELECT * FROM Words WHERE id = ?", reply[i * 2], recurQuery);
              else {

                var jsonData = JSON.stringify(container);

                connection.query("INSERT INTO word_rank(rank_json) VALUES(?)", jsonData, function (err, res) {
                  if (err) {
                    console.log(err);
                  }

                  redis.redisClient.multi().del('latest_id').set('latest_id', res['insertId']).exec_atomic(function (err, reply) {
                    if (err) {
                      console.log(err);
                    }
                  });

                  console.log('저장: ', jsonData);
                  connection.release();
                });

              }
            } else {
              console.log('Error while performing Query.', err);
            }
          }

          var i = 0;
          var container = new Object();
          container['rank_cnt'] = reply.length / 2;
          connection.query("SELECT * FROM Words WHERE id = ?", reply[i * 2], recurQuery);

        } else {
          console.log(err);
        }
      });

    }
  });

}

function saveUserWords(uId, wId, connection) {
  var data = [uId, wId];
  connection.query("INSERT INTO UserWords(user_id, word_id) Values (?) ON DUPLICATE KEY UPDATE count = count + 1", [data], function (err, row, fields) {
    if (!err) {
      console.log(row);
    } else
      console.log('Error while performing Query.', err);
  });
}

function getWords(data, uId) {
  pool.getConnection(function (err, connection) {
    if (!err) {

      connection.query("SELECT id FROM Words WHERE original = ? AND checked = ?", data, function (err, rows, fields) {
        if (!err) {
          if (rows.length > 0) {
            var rId = rows[0]['id'];
            redis.incrCount(rId);
            if (uId != undefined)
              saveUserWords(uId, rId, connection);
          } else {
            connection.query("INSERT INTO Words(original, checked) Values (?)", [data], function (err, row, fields) {
              if (!err) {
                console.log('new word input');
              } else
                console.log('Error while performing Query[INSERT].', err);
            });
          }
        } else
          console.log('Error while performing Query[SELECT].', err);
      });
    }

    connection.release();
  });
}

module.exports = {
  getWords: getWords,
  calcWordRank: calcWordRank,
  responseRank: responseRank
};