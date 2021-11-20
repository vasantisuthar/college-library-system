const mongoose = require('mongoose');
const dashboardSchema = new mongoose.Schema({
    studentId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student',
        required : true
    },
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required:true
    },
    title  : {type:String , required: true},
    author : {type : String, required: true},
    isbn : {type :String, required: true}
},{timestamps: true})

module.exports = mongoose.model('Dashboard',dashboardSchema);
