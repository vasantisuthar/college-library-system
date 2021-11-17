function student(req, res, next){
    if(req.isAuthenticated() && req.user.role === 'Student'){
        return next();
    }
    return res.redirect('/');
}

module.exports = student