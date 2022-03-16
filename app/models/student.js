const mongoose = require('mongoose');
const Schema = mongoose.Schema

const studentSchema = new Schema({
    name:{type : String, required: true},
    enrollment: {type:String, required: true},
    standard : {type:String, required:true},
    role: {type: String, default : 'Student'},
    activity:{type:String,required: false}
},{timestamps:true});
module.exports = { 
    Student : mongoose.model("Student", studentSchema), 
    studentSchema : studentSchema
};
