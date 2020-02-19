var amqp = require('amqplib/callback_api');
const testSet = require('./testset.json');
const queue = 'chatQueue';

// describe('Sample Test', () => {
//   it('should test that true === true', () => {
//     expect(true).toBe(true)
//   })
// })

function recvFormQueue() {
  var cnt = 0;
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
        console.log(spellRes);
        console.log(cnt++)
        // console.log(" [x] Received %s", spellRes);

      }, {
        noAck: true
      });
    });
  });
}

recvFormQueue();
var msg = {
  reqId: '4',
  userId: '1'
}

var sendToSpell = () => {
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

      for (var i = 0; i < 3000; i++){
        msg.context = testSet[i % 30];
        msg.userId = i+1;
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
          replyTo: 'chatQueue'
        });
      }
    });
  });
}

sendToSpell();