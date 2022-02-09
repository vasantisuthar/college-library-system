const mongoose = require('mongoose')
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const Grid1 = require('mongodb').Grid;

//gfs
const connection = mongoose.connection;

// Init gfs
let gfs;
let grisFsBucket;

connection.once('open', () => {
  // Init stream
  gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads'
  })
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('uploads');
});


function resourceController(){
    return{

    
    getResource(req, res){
        gfs.files.find().toArray((err, files) => {
            // Check if files
            if (!files || files.length === 0) {
                res.render('e-resources/resourcesInput', { files: false });
            } else {
                files.map(file => {
                if (
                    file.contentType === 'image/jpeg' ||
                    file.contentType === 'image/png'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
                return file;
                }).sort((a, b) => {
                  return (
                    new Date(b["uploadDate"]).getTime() -
                    new Date(a["uploadDate"]).getTime()
                  );
                });

                  return  res.render('e-resources/resourcesInput', { files: files });
                }
            });
    },
    uploadResource(req, res){
        res.redirect('/resources')
    },
    getFiles(req, res){
        gfs.files.find().toArray((err, files) => {
            // Check if files
            if (!files || files.length === 0) {
              return res.status(404).json({
                err: 'No files exist'
              });
            }
        
            // Files exist
            return res.json(files);
          });
    },
    getFileName(req, res){
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
              return res.status(404).json({
                err: 'No file exists'
              });
            }
            // File exists
            return res.json(file);
          });
    },
    getImageName(req, res){
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
              return res.status(404).json({
                err: 'No file exists'
              });
            }
        
            // Check if image
            if(file.contentType === 'image/jpeg' || file.contentType ==='image/png') 
            {
                const readStream = gridfsBucket.openDownloadStream(file._id);
                readStream.pipe(res);
            }else {
              res.status(404).json({
                err: 'Not an image'
              });
            }
          });
    },
    deleteResource(req, res){
      gridfsBucket.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
        if (err) return res.status(404).json({ err: err.message });
        res.redirect("/resources");
      });
    }
}
}
module.exports = resourceController;