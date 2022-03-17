const mongoose = require('mongoose');
const Schema = mongoose.Schema

const requestSchema = new Schema({
    title:{type : String, required: true},
    author: {type:String, required: true},
    edition : {type:String, required:true}
},{timestamps:true});

module.exports = mongoose.model("Student", requestSchema);
