const mongoose = require('mongoose');
const historySchema = mongoose.Schema({
    student :{
        type:mongoose.Types.Schema.ObjectId,
        ref:'Student',
        required:true
    },
    books :{
        type:Object ({
            bookId: {
                type:mongoose.Types.Schema.ObjectId({
                    book:{type:Object, required: true}
                }),
                ref:'Dashboard',
                required:true
            }
        })
    }
},{ timestamps: true })

module.exports = mongoose.model('History', historySchema);