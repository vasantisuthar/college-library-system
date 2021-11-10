const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title :         {type:String, required: true},
    author :        {type:String, required: true},
    edition :       {type:String, required: true},
    isbn :          {type:String, required:true},
    publisher:      {type:String, required:true},
    published:      {type:Date, required:true},
    qty:            {type:Number, required:true},
    preview:        {type:Buffer}
},{timestamps: true})

module.exports = mongoose.model("Book", bookSchema);