const authController = require('../app/http/controllers/authController');
const homeController = require('../app/http/controllers/homeController');
const adminController = require('../app/http/controllers/admin/adminController');
const studentController = require('../app/http/controllers/student/studentController');
//middlerwares
const auth = require('../app/http/middlewares/auth');
const guest = require('../app/http/middlewares/guest');
const admin = require('../app/http/middlewares/admin')

function initRoutes(app){

    //auth routes
    app.get('/login', guest, authController().login);
    app.post('/login',authController().postLogin);  
    app.get('/logout', authController().logout);

    // home controller
    app.get('/', auth ,homeController().index);
    app.post('/search',homeController().search);

    //student controller
    app.post('/dashboard', studentController().dashboard);

    //admin routes
    app.get('/add',admin,adminController().addbooks);
    app.post('/add',adminController().postBooks);
}

module.exports = initRoutes;