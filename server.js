//require modules
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose =require('mongoose');
const flash = require("express-flash");
const session  = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require("passport");
const Emitter = require('events');
const socket = require('socket.io');

const app = express();


// database connection

mongoose.connect(process.env.mongouri)
const connection = mongoose.connection;
connection.once('open',() => {
    console.log("database connected");
})

// event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

//session config
app.use(session({
    secret:process.env.secret,
    resave:false,
    store:  MongoStore.create({
        mongoUrl :process.env.mongouri,
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

const server = app.listen(3000, () => {
    console.log("server started at port 3000");
})
const io = socket(server);

io.on('connection', async (socket) => {
    console.log("socket connected");
})

eventEmitter.on('getBookQty',data =>{
    io.emit('getBook', data);
})