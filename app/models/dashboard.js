const mongoose = require('mongoose');
const dashboardSchema = new mongoose.Schema({
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required:true
    },
    title  : {type:String , required: true},
    author : {type : String, required: true},
    isbn   : {type :String, required: true},
    issued : {type:Boolean,required: false},
    charge: {type:Number, required:false},
    pay:    {type:Number, required:false},
    studentId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student',
        required : true
    },
    updatedAt:{type:Date, required:false}
},{timestamps: {
    createdAt:true,
    updatedAt: false
}})

module.exports = mongoose.model('Dashboard',dashboardSchema);
