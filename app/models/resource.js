const mongoose = require('mongoose')

const mongooseSchema = new mongoose.Schema({
    title:{type:String, required:true},
    link:String,
    description:String
})

module.exports = mongoose.model('Resource',mongooseSchema);