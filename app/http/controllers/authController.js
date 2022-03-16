const passport = require("passport");
const {Student} = require('../../models/student');
function authController(){
    return{
        login(req,res){
            res.render('auth/login');
        },
        postLogin(req, res,next){
            const {enrollment} = req.body;
            if(!enrollment){
                req.flash('error',"Enrollment-no is required");
                return res.redirect('/login')
            }
            Student.findOne({enrollment: enrollment},(err, student)=>{
                req.logIn(student,(err) =>{
                    if(err){
                        req.flash('error','Please enter correct enrollment no')
                    res.redirect('/login')
                    }else{
                        passport.authenticate("local",{failureRedirect:'/login', failureFlash: true})(req, res, () => {
                            res.redirect('/');
                        });
                    }
                })
            })
                
            
            
        },
        logout(req, res){
            req.logout();
            console.log("logged out");
            return res.redirect('/login');
        }
    }
}

module.exports = authController;