var mysql = require('mysql');
const db_config = require('../db-config.json')
var connection = mysql.createConnection({
  host     : db_config.host,
  user     : db_config.user,
  password : db_config.password,
  port     : db_config.port,
  database : db_config.database
});
connection.connect();

 function getWords(data){
    connection.query("SELECT DISTINCT * FROM Words WHERE original = ? AND checked = ?",data, function(err, rows, fields) {
        if (!err){
          if(rows.length > 0){
            var row_id = rows[0]['id'];
            connection.query("UPDATE Words SET error = error + 1 WHERE id = ?",row_id, function(err, rows, fields) {
              if (!err)
                console.log('errcount: ',rows);
              else
                console.log('Error while performing Query[UPDATE].', err);
            });
          }
          else{
            connection.query("INSERT INTO Words(original, checked) Values (?)",[data], function(err, rows, fields) {
              if (!err)
                console.log('New word INSERT');
              else
                console.log('Error while performing Query[INSERT].', err);
            });
          }
        }
        else
          console.log('Error while performing Query[SELECT].', err);
      });
}

module.exports = {
    getWords : getWords
  };

     