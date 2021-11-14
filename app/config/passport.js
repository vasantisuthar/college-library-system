const LocalStrategy = require('passport-local').Strategy;
const Student = require('../models/student');

function init(passport){
    passport.use(new LocalStrategy({usernameField:"enrollment", passwordField:"enrollment"}, async function( enrollment, pass, done){
                const user = await Student.findOne({enrollment : enrollment})
                return done(null, user)
        }
    ))  
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        Student.findById(id, (err, user) => {
            done(err, user)
        })
    })

}

module.exports = init;