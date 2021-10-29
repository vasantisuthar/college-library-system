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
            Book.findOne({title:searchedBook}, (err, foundBook) =>{
                if(!err){
                    if(foundBook){
                        console.log(foundBook)
                        res.render('student/search',{
                            title:foundBook.title, 
                            author : foundBook.author, 
                            edition : foundBook.edition,
                            id : foundBook._id
                    })
                    }else if(!foundBook){
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