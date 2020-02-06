var amqp = require('amqplib/callback_api');
let chats = require('../model/chat');
let {user} = require('../models')

const sQueue = 'spellQueue';
const rQueue = 'chatQueue';

module.exports = {
    checkSpell: async (userID, chatID) => {

        let chat = await chats.findById(chatID);
        

        let msg = {
            context: chat.origin_context,
            reqId: chatID,
            userId: userID
        };

        amqp.connect('amqp://localhost', function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                channel.assertQueue(sQueue, {
                    durable: false
                });

                channel.sendToQueue(sQueue, Buffer.from(JSON.stringify(msg)), {
                    replyTo: rQueue
                });
                console.log(" [x] Sent %s", msg);
                setTimeout(function () {
                    connection.close();
                }, 500);
            });
        });
    },
    recvFormQueue: () => {
        console.log('START RECV FROM RABBITMQ!!')
        amqp.connect('amqp://localhost', function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
               
                channel.assertQueue(rQueue, {
                    durable: false
                }); 

                channel.consume(rQueue, async function (msg) {
                    let result = JSON.parse(JSON.parse(msg.content));
                    console.log(" [x] Received %s", result);
                    
                    let chat = await chats.findById(result.requestId);

                    if (result.errors != 0) {
                        chat.check_context = result.correct;
                        chat.status = 0;
                        let userRecord = await user.findByPk(result.userId);
                        userRecord.error_cnt += result.errors;
                        userRecord.save();
                    } else {
                        chat.status = 1;
                    }
                    
                    chat.save()
                        .then((afterCheck) => {
                            console.log("spell check 완료");
                        })
                        .catch((err) => {
                            console.log("spell check 실패 :", err);
                        })

                }, {
                    noAck: true
                });
            });
        });
    }
}