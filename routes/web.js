const authController = require('../app/http/controllers/authController');
const homeController = require('../app/http/controllers/homeController');
const adminController = require('../app/http/controllers/admin/adminController');

//middlerwares
const auth = require('../app/http/middlewares/auth');
const guest = require('../app/http/middlewares/guest');
const admin = require('../app/http/middlewares/admin')

function initRoutes(app){
    app.get('/login', guest, authController().login);
    app.post('/login',authController().postLogin);
    app.get('/', auth ,homeController().index);

    //admin routes
    app.get('/add',admin,adminController().addbooks);
}

module.exports = initRoutes;