var mongoose = require('mongoose')
var Schema = mongoose.Schema

var chatSchema = new Schema({
    speaker : { type: Number, required: true } , //user id from MySQL
    time : { type: Date, default: Date.now(), required: true },
    origin_context : { type: String, required: true },
    check_context : { type: String, default: "" }, //맞춤법 교정된 내용
    status : { type: Number, default: -1 }, //맞춤법 교정 여부 및 결과 -1(미교정), 0(맞음), 1(틀림)
    room : { type: Number }, //room의 _id
},{ versionKey:'_somethingElse'})

module.exports = mongoose.model('chat',chatSchema)