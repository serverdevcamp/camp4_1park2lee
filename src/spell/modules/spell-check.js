const request = require('request');
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();
const decode = entities.decode;

const split = require('./split-string').byWordCount;

// parses server response
function getAttr(string, key) {
    const found = string.indexOf(key);
    const firstQuote = string.indexOf('"', found + 1);
    const secondQuote = string.indexOf('"', firstQuote + 1);
    return string.substr(firstQuote + 1, secondQuote - firstQuote - 1);
}

// parses server response
function getJSON(response) {
    var found = -1;
    var typos = [];

    while (found = response.indexOf("data-error-type", found + 1), found != -1) {
        const end = response.indexOf(">", found + 1);
        var line = response.substr(found, end - found);
        var aTypo = {};

        aTypo.type = decode(getAttr(line, "data-error-type="));
        aTypo.token = decode(getAttr(line, "data-error-input="));
        aTypo.suggestions = [decode(getAttr(line, "data-error-output="))];
        aTypo.context = decode(getAttr(line, "data-error-context="));

        const infoBegin = response.indexOf('<div>', found);
        var infoEnd = response.indexOf('</div>', infoBegin + 1);
        // in case info has another <div>
        const infoNextEnd = response.indexOf('</div>', infoEnd + 1);
        const nextFound = response.indexOf('inner_spell', infoBegin);
        if (infoNextEnd != -1 && (nextFound == -1 || nextFound > infoNextEnd)) {
            infoEnd = infoNextEnd;
        }

        var info = decode(response.substr(infoBegin, infoEnd + 6 - infoBegin));
        info = info.replace(/\t/g, '');
        info = info.replace(/<strong class[^>]*>[^>]*>\n/gi, '');
        info = info.replace(/<br[^>]*>/gi, "\n");
        info = info.replace(/<[^>]*>/g, "");
        info = info.replace(/\n\n\n\n\n/g, '\n\n(예)\n');
        info = info.replace(/\n\n*$/g, "");
        info = info.replace(/^[ \n][ \n]*/g, "");

        aTypo['info'] = info;

        typos.push(aTypo);
    }
    return typos;
}

const DAUM_URL = 'https://dic.daum.net/grammar_checker.do';
const DAUM_MAX_CHARS = 1000;


function spellCheck(sentence, timeout, callback) {
    const data = split(sentence.replace(/\n/g, "\n "), DAUM_MAX_CHARS);
    let i = 0;
    let result = [];

    const getResponse = function (err, response, body) {
        if (!err && response.statusCode === 200) {
            result.push(getJSON(body));
        } else {
            if (err) callback(undefined, err);
        }

        if (i < data.length) {
            request.post({
                url: DAUM_URL,
                timeout: timeout,
                agent: false, pool: {maxSockets: 200},
                form: {
                    sentence: data[i++]
                }
            }, getResponse);
        } else {
            callback(result)
        }

    };

    request.post({
        url: DAUM_URL,
        timeout: timeout,
        form: {
            sentence: data[i++]
        }
    }, getResponse);

}

module.exports = spellCheck;