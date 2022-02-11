const mongoose = require('mongoose')
const Resource = require('../../../models/resource');
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
    
    addResources(req, res){
      res.render('e-resources/addResources');
    },
    
    getResource(req, res){
        gfs.files.find().toArray((err, files) => {
            // Check if files
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
                  Resource.find({},(err, result)=>{
                    if(result){
                      return res.render('e-resources/resourcesInput', { files: files, result:result });
                    }else if(files){
                      return res.render('e-resources/resourcesInput', { files: files, result:false});
                    }else if(!files){
                        return res.render('e-resources/resourcesInput', {result:result, files:false})
                    }
                  })
                
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
        return res.redirect("/resources");
      });
    },
    postLinks(req, res){
      const linkTitle = req.body.linkTitle;
      const linkUrl = req.body.links;
      const description = req.body.description;
      const resource = new Resource({
        title:linkTitle,
        link : linkUrl,
        description: description
      })

      resource.save();
      res.redirect('/resources');
    },
    deleteLink(req, res){
      const deleteResource  = req.body.deleteResource;
      Resource.findByIdAndDelete({_id:deleteResource},(err, done) =>{
        if(done){
          return res.redirect('/resources');
        }else{
          console.log(err);
        }
      })
    },
    searchResource(req, res){
      const file = req.body.fileName;
      Resource.find({$or:[{title:{$regex:file, $options: "$i"}},
            {description: {$regex:file,$options:"$i"}}]},(err, result) =>{
              if(result.length !=0){
                return res.render('e-resources/resourcesInput',{result: result, files:false})
              }else if(result.length === 0){
                gfs.files.findOne({filename: {$regex: file, $options:"$i"}},(err, files) =>{
                  if(!err){
                    if(files.length != 0){
                      console.log(files);
                      res.render('e-resources/resourcesInput',{files:files, result:false})
                    }
                  }
                })
              }
        })
    }
}
}
module.exports = resourceController;