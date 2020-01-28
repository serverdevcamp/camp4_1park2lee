var mongoose = require('mongoose')
var Schema = mongoose.Schema

var roomSchema = new Schema({
    name: String, 
    member: [ Number ], //user ids from MySQL
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'chat' }], 
    countUnread: [ Number ], //member 크기의 배열, 각자 읽지 않은 대화의 양, 해당 인덱스에 표시
    countMember : { type: Number }, 
    //date: { type: Date, default: Date.now() },
},{ versionKey:'_somethingElse'})

module.exports = mongoose.model('room', roomSchema)