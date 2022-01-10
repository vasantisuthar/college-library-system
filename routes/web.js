const express = require("express");
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

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
    app.get('/payment/index',auth,PaymentController().index);
    app.post("/paynow", [parseUrl, parseJson],PaymentController().postRequestForPayment);
    app.post("/callback",PaymentController().verifyPayment);

    //book controller
    app.get('/book/:id',auth,studentController().getBook);

    //admin routes
    app.get('/add',admin,adminController().addbooks);
    app.post('/add',adminController().postBooks);
    app.get('/register',admin, adminController().register);
    app.post('/register',adminController().registerStudent);
    app.get('/admindashboard',adminController().adminDashboard);
    app.get('/dashboard/:enrollment',admin, adminController().getDetails);
    app.post('/searchEnroll',adminController().searchEnroll);
    app.post('/returnIssuedBook', adminController().returnBook);

    
}

module.exports = initRoutes;