const Student = require('../../models/student');
function homeController(){
    return{
        index(req, res){
            var studentName;
            session = req.session.passport.user
            if(session){
                Student.findById(session,(err, student)=>{
                    if(!err){
                        if(student){
                            studentName = student.name;
                            res.render('home',{name: studentName});
                        }
                    }
                })

            }
        }
    }
}

module.exports = homeController;