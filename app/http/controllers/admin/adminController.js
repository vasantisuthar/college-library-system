const Book = require('../../../models/books');
const Dashboard = require('../../../models/dashboard');
const Student = require('../../../models/student');
const moment = require('moment')
function adminController(){
    return{
        addbooks(req, res){
            res.render('admin/addBooks');
        },
        postBooks(req, res){
            const {title, author, edition, published, isbn, publisher, qty,totalBooks,preview} = req.body;
            const book = new Book({
            title,
            author,
            edition,
            published,
            isbn,
            publisher,
            qty,
            totalBooks,
            preview
            })
            book.save().then((book) =>{
                req.flash('success',"Book is added successfully");
                return res.redirect('/')
            })
            .catch(err =>{
                req.flash('error',"something went wrong")
                return res.redirect('/add');
            })
        },
        register(req, res){
            res.render('auth/register');
        },
        registerStudent(req, res){
            const{name, enrollment, standard} = req.body;
            if(!enrollment || !name || !standard){
                req.flash('error',"All fields are required");
                return res.redirect('/register');
            }

            //Check if student exists
            Student.exists({enrollment:enrollment},(err, foundStudent) =>{
                if(foundStudent){
                    req.flash("error","Enrollment-no already exist");
                    return res.redirect('/register');
                }
            })

            const student = new Student({
                name,
                enrollment,
                standard
            })

            student.save().then((student) =>{
                req.flash('success',"Student added successfully");
                return res.redirect('/register');
            }).catch(err => {
                req.flash('error',"Something went wrong")
                console.log(err);
                return res.redirect('/register')
            });
            
        },
        adminDashboard(req, res){
            Student.find({activity: "issued"},(err, foundStudent) =>{
                if(foundStudent){
                    res.render('admin/adminDashboard',{foundEnrollment : foundStudent});
                }else{
                    console.log(err);
                }
            })
        },
        getDetails(req, res){
            const enrollment = req.params.enrollment;
            Student.findOne({enrollment:enrollment, activity:"issued"},(err, found) =>{
                if(found){
                Dashboard.find({studentId: found._id},(err, foundDetails) =>{
                        if(err){
                            console.log(err)
                        }else{
                            res.render('admin/details',{foundDetails: foundDetails,studentId:found._id, moment : moment})
                        }
                })
            }
                
            })
        },
        searchEnroll(req, res){
            if(req.body.hasOwnProperty("searchEnrollment")){
            const enroll = req.body.enroll;
            Student.findOne({enrollment:enroll, activity:"issued"},(err, found) =>{
                res.redirect('dashboard/' + enroll);
            })
        }
    },
    returnBook(req, res){
            const dashboardStudentId = req.body.studentId;
            const bookIsbn = req.body.bookIsbn;

            Dashboard.findOneAndDelete({isbn: bookIsbn},{studentId : dashboardStudentId},(err, result) =>{
                if(result){
                    Book.findOneAndUpdate({isbn:bookIsbn},{$inc:{qty:1}},(err, updated)=>{
                            if(updated){
                                res.redirect('/adminDashboard')
                                console.log("return")
                            }else{
                                console.log(err);
                            }
                        
                    })
                }
            })
        }
    }
}
module.exports= adminController;