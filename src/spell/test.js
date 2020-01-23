const hanspell = require('hanspell');

const sentence = '안녕하세요';
const end = function () { console.log("<ends>"); };
const error = function (err) { console.error("<error: " + err + ">"); };

async function spellCheck(context){
    let result = await hanspell.spellCheckByPNU(context, 6000, console.log, end, error);
    console.log('funct'+result);
    return result;
}


 result = spellCheck(sentence);
 console.log(res);