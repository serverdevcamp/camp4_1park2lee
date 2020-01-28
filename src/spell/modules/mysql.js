var mysql = require('mysql');
const db_config = require('../db-config.json')
var pool = mysql.createPool(db_config);

 function getWords(data){
  pool.getConnection(function(err,connection){
    if(!err){
      connection.query("SELECT DISTINCT * FROM Words WHERE original = ? AND checked = ?",data, function(err, rows, fields) {
        if (!err){
          var row_id;
          if(rows.length > 0){
             row_id = rows[0]['id'];
            connection.query("UPDATE Words SET error = error + 1 WHERE id = ?",row_id, function(err, rows, fields) {
              if (!err)
                console.log('errcount: ',rows);
              else
                console.log('Error while performing Query[UPDATE].', err);
            });
          }
          else{
            connection.query("INSERT INTO Words(original, checked) Values (?)",[data], function(err, row, fields) {
              if (!err){
                console.log('New word INSERT: ',row['insertId']);
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
    getWords : getWords
  };

     