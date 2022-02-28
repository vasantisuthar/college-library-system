const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const crypto = require('crypto')
const path = require('path');


const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/Library',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                title: req.body.title,
                bucketName: "uploads"
            };
            resolve(fileInfo);
        });
        });
    }
    });

    const upload = multer({
        storage
    });




const express = require("express");


const authController = require('../app/http/controllers/authController');
const homeController = require('../app/http/controllers/homeController');
const adminController = require('../app/http/controllers/admin/adminController');
const studentController = require('../app/http/controllers/student/studentController');
//middlerwares
const auth = require('../app/http/middlewares/auth');
const guest = require('../app/http/middlewares/guest');
const admin = require('../app/http/middlewares/admin');
const student = require('../app/http/middlewares/student');
const PaymentController = require('../app/http/controllers/student/paymentController');
const newsController = require("../app/http/controllers/newsController");
const resourcesController = require("../app/http/controllers/e-resources/resourcesController");

// const bookController = require('../app/http/controllers/bookController');
function initRoutes(app){

    //auth routes
    app.get('/login', guest, authController().login);
    app.post('/login',authController().postLogin);  
    app.get('/logout', authController().logout);

    // home controller
    app.get('/', auth ,homeController().index);
    app.post('/search',homeController().search);

    //student controller
    // app.post('/dashboard', studentController().dashboard);
    app.get('/dashboard', student ,studentController().getDashboard);
    app.post('/issueBook',student, studentController().issueBook);
    app.post('/removeIssuedBook', studentController().removeIssuedBook);

    // payment routes
    app.post("/payment", PaymentController().postRequestForPayment);

    //book controller
    app.get('/book/:id',auth,studentController().getBook);
    
    // news 
    app.get('/news',auth, newsController().getNews);
    //admin routes
    app.get('/add',admin,adminController().addbooks);
    app.post('/add',adminController().postBooks);
    app.get('/register',admin, adminController().register);
    app.post('/register',adminController().registerStudent);
    app.get('/admindashboard',adminController().adminDashboard);
    app.get('/dashboard/:enrollment',admin, adminController().getDetails);
    app.post('/searchEnroll',adminController().searchEnroll);
    app.post('/returnIssuedBook', adminController().returnBook);
    app.get('/student/history', adminController().getHistory);
    app.get('/student/currentlyissued', adminController().currentlyIssued);
    app.post('/searchEnrollForIssued',adminController().searchEnrollForIssued);
    // app.post('/studentBookIsIssued', adminController().studentIssuedBook);

    //e-resources
    app.get('/resources', resourcesController().getResource);
    app.get('/addresources', resourcesController().addResources);
    app.get('/files', resourcesController().getFiles);
    app.get('/files/:filename', resourcesController().getFileName);
    app.get('/image/:filename', resourcesController().getImageName);
    app.post('/upload',upload.single('file'),resourcesController().uploadResource);
    app.post('/files/:id',resourcesController().deleteResource);
    app.post('/links',resourcesController().postLinks);
    app.post('/deleteLink', resourcesController().deleteLink);

    //search
    app.post('/searchResource',resourcesController().searchResource);
    
}

module.exports = initRoutes;