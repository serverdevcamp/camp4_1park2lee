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

 function saveUserWords(uId, wId,connection){
   console.log('saveUSER');
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
    rankByCount : rankByCount
  };

     