const hanspell = require('hanspell');

const sentence = '안녕하 세요';
const end = function () { console.log("<ends>"); };
const error = function (err) { console.error("<error: " + err + ">"); };


result = hanspell.spellCheckByPNU(sentence, 6000, console.log, end, error);
console.log(result)