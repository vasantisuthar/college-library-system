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
            const {title, author, edition, published, isbn, publisher, qty,preview} = req.body;
            const book = new Book({
            title,
            author,
            edition,
            published,
            isbn,
            publisher,
            qty,
            preview
            })
            book.save().then((book) =>{
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
                    Dashboard.find({studentId: found._id},(err, foundDetails) =>{
                        if(err){
                            console.log(err)
                        }else{
                            res.render('admin/details',{foundDetails: foundDetails, moment : moment})
                        }
                })
                
            })
        },
        searchEnroll(req, res){
            if(req.body.hasOwnProperty("searchEnrollment")){
            const enroll = req.body.enroll;
            Student.findOne({enrollment:enroll, activity:"issued"},(err, found) =>{
                res.redirect('dashboard/' + enroll);
            })
        }
    }
    }
}
module.exports= adminController;