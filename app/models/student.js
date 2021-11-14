const mongoose = require('mongoose');
const Schema = mongoose.Schema

const studentSchema = new Schema({
    name:{type : String, required: true},
    enrollment: {type:String, required: true},
    standard : {type:String, required:true},
    role: {type: String, default : 'Student'}
},{timeStamps:true});
module.exports = mongoose.model("Student", studentSchema);
