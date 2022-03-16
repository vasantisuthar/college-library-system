const mongoose = require('mongoose');
const Schema = mongoose.Schema

const studentSchema = new Schema({
    name:{type : String, required: false},
    enrollment: {type:String, required: false},
    standard : {type:String, required:false},
    role: {type: String, default : 'Student'},
    activity:{type:String,required: false},
    email:{type:String, required: false}
},{timestamps:true});
module.exports = { 
    Student : mongoose.model("Student", studentSchema), 
    studentSchema : studentSchema
};
