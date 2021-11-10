const Student = require('../../models/student');
const Book = require('../../models/books');
function homeController(){
    return{
        index(req, res){
            var studentName;
            session = req.session.passport.user
            if(session){
                Student.findById(session,(err, student)=>{
                    Book.find({}, (err, foundBooks) => {
                        if(!err){
                            if(student){
                                studentName = student.name;
                                res.render('home',{name: studentName, foundBooks: foundBooks});
                            }
                        }
                    })
                })
            }
        },
        search(req, res){
            const searchedBook = req.body.bookname;
            Book.find({$or : [{title:{$regex: searchedBook, $options:"$i"}}, 
                {author:{$regex: searchedBook, $options:"$i"}}]}, (err, foundBook) =>{
                if(!err){
                    if(foundBook.length != 0){
                        res.render('student/search',{foundBook: foundBook})
                    }else if(foundBook.length == 0){
                        req.flash("search","Not found");
                        return res.redirect('/');
                    }
                }else{
                        res.redirect("/");
                    }
            })
        }
    }
}

module.exports = homeController;