var mysql = require('mysql');
const db_config = require('../db-config.json')
var pool = mysql.createPool(db_config.mysql);
var redis = require('../modules/redis');


 function rankByCount(){
//   pool.getConnection(function(err,connection){
//     if(!err){
//       connection.query("select * from Words ORDER BY error desc limit 3", function(err, rows, fields) {
//         if (!err){
//           console.log(rows);
//         }
//         else
//           console.log('Error while performing Query[rank].');
//       });
//     }
//     else{
//       console.log(err);
//     }
//  });
}
 function findWordById(id){
  
  redis.redisClient.ZREVRANGE("words", 0, 2, 'WITHSCORES', function(err, reply){
    if(err){
        return;
    }
    else{
      pool.getConnection(function(err,connection){
      if(!err){
        var i;
        var redisMulti = redis.redisClient.multi();
        for(v = 0; i < 3; i++)
          redisMulti.del('rank:'+(i+1));
        for(i = 0; i < reply.length/2; i++){
          var id = reply[i*2];
          var key = 'rank:'+(i+1);
          var count = reply[(i*2)+1];
          console.log('cnt:',count);
          connection.query("SELECT DISTINCT * from Words WHERE id = ?", id, function(err, rows, fields) {
            if (!err){
              console.log(rows[0]);
      
              redisMulti
              .hmset(key,{
                'og':rows[0]['original'],
                'ch':rows[0]['checked'],
                'cnt': count,
            }).exec();
            }
            else{
              console.log(err);
            }
              
          });
      
    };
        
      }
      else{
        console.log(err);
      }
   });
      
    }
});
  
}

 function saveUserWords(uId, wId,connection){
   var data = [uId,wId];
  connection.query("INSERT INTO UserWords(user_id, word_id) Values (?) ON DUPLICATE KEY UPDATE count = count + 1",[data], function(err, row, fields) {
    if (!err){
      console.log(row);
    }
    else
      console.log('Error while performing Query.', err);
  });
 }

 function getWords(data, uId){
  pool.getConnection(function(err,connection){
    if(!err){
    
      connection.query("SELECT DISTINCT id FROM Words WHERE original = ? AND checked = ?",data, function(err, rows, fields) {
        if (!err){
          if(rows.length > 0){
            var rId = rows[0]['id'];
            redis.incrCount(rId);
            if(uId != undefined)
            saveUserWords(uId,rId,connection);
          }
          else{
            connection.query("INSERT INTO Words(original, checked) Values (?)",[data], function(err, row, fields) {
              if (!err){
                console.log('new word input');
              }
              else
                console.log('Error while performing Query[INSERT].', err);
            });
          }
        }
        else
          console.log('Error while performing Query[SELECT].', err);
      });
    }
    // 커넥션을 풀에 반환
    connection.release();
  });
}

module.exports = {
    getWords : getWords,
    rankByCount : rankByCount,
    findWordById : findWordById,
  };

     