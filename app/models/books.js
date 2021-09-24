const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name : {type :String, required: true},
    author : {type:String, required: true},
    edition : {type:String , required: true}
})

module.exports = bookSchema;