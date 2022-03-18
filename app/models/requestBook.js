const mongoose = require('mongoose');
const Schema = mongoose.Schema

const requestSchema = new Schema({
    studentId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student',
        required : true
    },
    title:{type : String, required: true},
    author: {type:String, required: true},
    edition : {type:String, required:false}
},{timestamps:true});

module.exports = mongoose.model("RequestBook", requestSchema);
