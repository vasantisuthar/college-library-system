const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const mongoose = require('mongoose')
function init(mongoose){
    var gfs;
    mongoose.connect('mongodb://localhost:27017/Library')
    const connection = mongoose.connection;

    connection.once('open',() => {
        gfs = new mongoose.mongo.GridFSBucket(connection.db, {
            bucketName: 'uploads',
        });
        console.log("database connected");
        var gfs = triggered(gfs);
        return gfs;
    })
}

function triggered(gfs){
    return gfs;
}

module.exports = init;