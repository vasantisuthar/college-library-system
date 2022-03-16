const mongoose = require('mongoose');
const {studentSchema} = require('../models/student');
const {dashboardSchema} = require('../models/dashboard');

const historySchema = new mongoose.Schema({
    studentId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student'
    },    
    student:{type:Object},
    books : {type:Array}
},{ timestamps: true })

module.exports = mongoose.model('History', historySchema);