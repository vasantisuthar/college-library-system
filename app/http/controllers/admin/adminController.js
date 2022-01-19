const Book = require('../../../models/books');
const Dashboard = require('../../../models/dashboard');
const Student = require('../../../models/student');
const moment = require('moment')
const nodemailer = require('nodemailer');
function adminController(){
    return{
        addbooks(req, res){
            res.render('admin/addBooks');
        },
        postBooks(req, res){
            const {title, author, edition, published, isbn, publisher, qty,totalBooks,preview} = req.body;
            Book.findOne({isbn:isbn},(err, found) =>{
                if(found){
                    req.flash('error',"Book already exists with the ISBN number");
                    return res.redirect('/add');
                }else{
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
                            return res.redirect('/add')
                        })
                        .catch(err =>{
                            req.flash('error',"something went wrong")
                            return res.redirect('/add');
                        })
                }
            })
            
        },
        register(req, res){
            res.render('auth/register');
        },
        registerStudent(req, res){
            const{name, email, enrollment, standard} = req.body;
            if(!email || !enrollment || !name || !standard){
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
                standard,
                email
            })

            student.save().then((student) =>{
                req.flash('success',"Student registered successfully");
                var userEmail = 'yourUserName@gmail.com';
                var userPassword = 'yourPassword';

                var transporter = nodemailer.createTransport(`smtps://${userEmail}:${userPassword}@smtp.gmail.com`);


                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: userEmail,    // sender address
                    to: email, // list of receivers
                    subject: 'Registration to e-library', // Subject line
                    text: 'You are successfully registered for e-library',       // plaintext body
                    html: '<p>Login with this enrollment</p><b>{enrollment}</b>' // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
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
                    Dashboard.countDocuments({studentId:dashboardStudentId}).then(count =>{
                        console.log(count)
                        if(count == 0){
                            Student.findOneAndUpdate({_id:dashboardStudentId},{$set:{activity:"returned"}},(err, returned) =>{
                                if(returned){
                                    console.log("returned")
                                }else{
                                    console.log(err)
                                }
                            })
                        }
                    })
                    
                    Book.findOneAndUpdate({isbn:bookIsbn},{$inc:{qty:1}},(err, updated)=>{
                            if(updated){
                                res.redirect('/adminDashboard')
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