//require modules
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose =require('mongoose');
const flash = require("express-flash");
const session  = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require("passport");
const app = express();


//database connection
mongoose.connect('mongodb://localhost:27017/Library')
const connection = mongoose.connection;
connection.once('open',() => {
    console.log("database connected");
})

//session config
app.use(session({
    secret:"Mysecretcode",
    resave:false,
    store:  MongoStore.create({
        mongoUrl :'mongodb://localhost:27017/Library',
        collectionName:"sessions"
    }),
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} //24 hour
}))


// passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

//assets
app.use(flash());
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json());

//global middleware
app.use((req, res, next) =>{
    res.locals.session = req.session
    res.locals.user = req.user
    next();
})
//set template engine
// app.use(expressLayout);
app.set('views',path.join(__dirname + '/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app);

app.use((req, res) => {
    res.status(404).render('errors/error');
})

app.listen(3000, () => {
    console.log("server started at port 3000");
})