const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose')

let gfs;

function init(mongoose){
    mongoose.connect('mongodb://localhost:27017/Library')
    const connection = mongoose.connection;

        // `delay` returns a promise
        return new Promise(function(resolve, reject) {
          // Only `delay` is able to resolve or reject the promise
          connection.once('open',() => {
            gfs = Grid(connection.db, mongoose.mongo);
            gfs.collection('uploads');
            // console.log("gfs is", gfs)
        })
        });
      
     
    

}

init(mongoose)
.then(function(v) { // `delay` returns a promise
  console.log("gfsss is ",v); // Log the value once it is resolved
})
.catch(function(v) {
    console.log("noting")
  // Or do something else if it is rejected
  // (it would not happen in this example, since `reject` is not called).
});

// console.log("gfs" ,gfs)

function returnGfs(){
    console.log("gfs is" , gfs)
    return gfs;
}

module.exports = {init, returnGfs};