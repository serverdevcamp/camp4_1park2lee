var amqp = require('amqplib/callback_api');
const queue = 'chatQueue'; 

var msg = {
  context: '강아지같은사람!',
  reqId: '4',
  userId: '1'
}

function recvFormQueue() {
  
  amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(queue, {
        durable: false
      });

      channel.consume(queue, function (msg) {
     
        let spellRes = JSON.parse(JSON.parse(msg.content));
        console.log(" [x] Received %s", spellRes);

      }, {
        noAck: true
      });
    });
  });
}

recvFormQueue();
var sendToSpell = (msg) => {
  let queue = 'spellQueue';
  amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      

      channel.assertQueue(queue, {
        durable: false
      });

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
        replyTo: 'chatQueue'
      });
      console.log(" [x] Sent %s", msg);
    });
  });
}

sendToSpell(msg)
