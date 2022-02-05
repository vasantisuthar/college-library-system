// const {gfs} = require('../../../config/connection');
const mongoose = require('mongoose')

var gfs;
    mongoose.connect('mongodb://localhost:27017/Library')
    const connection = mongoose.connection;

    connection.once('open',() => {
        gfs = new mongoose.mongo.GridFSBucket(connection.db, {
            bucketName: 'uploads',
        });
        console.log("database connected");
})

function resourcesController(){
    return{
        getResource(req, res){
            if(!gfs) {
                console.log("some error occured, check connection to db");
                res.send("some error occured, check connection to db");
                process.exit(0);
            }
            gfs.find().toArray((err, files) => {
                // check if files
                if (!files || files.length === 0) {
                    return res.render("e-resources/resourcesInput", {
                    files: false
                });
                } else {
                    const f = files
                    .map(file => {
                        if (
                            file.contentType === "image/png" ||
                            file.contentType === "image/jpeg"
                        ) {
                            file.isImage = true;
                        } else {
                            file.isImage = false;
                        }
                        return file;
                    })
                    .sort((a, b) => {
                        return (
                            new Date(b["uploadDate"]).getTime() -
                            new Date(a["uploadDate"]).getTime()
                        );
                    });
            
                    return res.render("e-resources/resourcesInput", {
                        files: f
                    });
                }
            
                // return res.json(files);
                });
        },
        postResources(req, res){
            app.post("/upload", upload.single("file"), (req, res) => {
                // res.json({file : req.file})
                res.redirect("/");
            });      
            app.get("/files", (req, res) => {
                gfs.find().toArray((err, files) => {
                  // check if files
                    if (!files || files.length === 0) {
                        return res.status(404).json({
                        err: "no files exist"
                    });
                }
            
                return res.json(files);
            });
        });
        },
        upload(req, res){
                res.redirect('/');
        },
        getFileName(req, res){
            
                gfs.find(
                {
                    filename: req.params.filename
                },
                (err, file) => {
                    if (!file) {
                return res.status(404).json({
                        err: "no files exist"
                });
            }
                    return res.json(file);
            }
                );
        },
        getImage(req, res){
            // console.log('id', req.params.id)
            const file = gfs
            .find({
                filename: req.params.filename
            })
            .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                err: "no files exist"
            });
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
        }
    }
}

module.exports = resourcesController;