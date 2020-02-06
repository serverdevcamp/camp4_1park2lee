const amqp = require('amqplib/callback_api')
const mysql = require('./mysql')
const spellCheck = require('./spell-check')

const fastJSON = require('fast-json-stable-stringify')


const receiveQueue = 'spellQueue'


function queueStart() {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(receiveQueue, {
                durable: false
            });

            channel.consume(receiveQueue, function (msg) {
                let msgObject = JSON.parse(msg.content.toString());
                let result;


                if (msgObject.context == undefined || msgObject.reqId == undefined) {
                    return;
                }

                let errCount = 0;
                spellCheck(msgObject.context, 10000, function (message, err) {
                    if (err) return;
                    else {
                        channel.ack(msg)

                        for (var i = 0; i < message.length; i++) {
                            for (var j = 0; j < message[i].length; j++) {

                                let token = message[i][j]['token'];
                                let suggestion = message[i][j]['suggestions'][0];

                                if (token == suggestion) continue;
                                msgObject.context = msgObject.context.replace(token, suggestion);
                                errCount++;

                                let data = [token, suggestion]
                                if (msgObject.userId != undefined) mysql.getWords(data, msgObject.userId)

                            }
                        }

                        result = fastJSON({
                            status: 1,
                            correct: msgObject.context,
                            errors: errCount,
                            userId: msgObject.userId,
                            requestId: msgObject.reqId,
                        })

                        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)))
                    }
                });
            }, {
                noAck: false
            });
        });
    });
}



module.exports = {
    queueStart: queueStart
}