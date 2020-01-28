var mysql = require('mysql');
const db_config = require('../db-config.json')
var pool = mysql.createPool(db_config);

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
        connection.query("INSERT INTO Words(original, checked) Values (?) ON DUPLICATE KEY UPDATE error = error + 1",[data], function(err, row, fields) {
        if (!err){
          var rId = row['insertId'];
          console.log(rId);
          if(uId != undefined)
          saveUserWords(uId,rId,connection);
        }
        else
          console.log('Error while performing Query.', err);
      });
    }
    // 커넥션을 풀에 반환
    connection.release();
  });
}

module.exports = {
    getWords : getWords
  };

     