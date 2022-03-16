const csvtojson = require('csvtojson');
const Book = require('../../../models/books');
const {Dashboard} = require('../../../models/dashboard');
const {Student} = require('../../../models/student');
const History = require('../../../models/history');
var excelToJson = require('convert-excel-to-json');

const nodemailer = require('nodemailer');

const moment = require('moment')
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
                var userEmail = process.env.email_id;
                var userPassword = process.env.user_password;

                //send mail
                var transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,                    
                    auth: {
                        user: userEmail,
                        pass: userPassword
                    },
                    
                    });
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
                    }else{
                        console.log("mail send")
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
        adminDashboard(req, res){ //show the list of students who want to issue the book
            Student.find({activity: "issued"},(err, foundStudent) =>{
                if(foundStudent){
                    res.render('admin/adminDashboard',{foundEnrollment : foundStudent});
                }else{
                    console.log(err);
                }
            })
        },
        getDetails(req, res){ // show the details of the book details of the students who want to issue the book
            const enrollment = req.params.enrollment;
            Student.findOne({enrollment:enrollment, activity:"issued"}).then(found => {
                if(found){
                Dashboard.find({studentId: found._id},(err, foundDetails) =>{
                    res.render('admin/details',{foundDetails: foundDetails,studentId:found._id, moment : moment})
                        
                })
            }
            }).catch(err => {
                console.log(err)
            })
        },
        searchEnroll(req, res){ // search the student with their enrollment no
            if(req.body.hasOwnProperty("searchEnrollment")){
            const enroll = req.body.enroll;
            Student.findOne({enrollment:enroll, activity:"issued"},(err, found) =>{
                res.redirect('dashboard/' + enroll);
            })
        }
    },
    currentlyIssued(req, res){ // show the list of students who has issued the book
        Dashboard.find({issued:true}).populate('studentId').then(found => {
            res.render('admin/currentlyIssued',{foundStudents:found, searchedStudent:null});
        }).catch(error => console.log(error))
    },
    searchEnrollForIssued(req, res){ // search among the issued book students with their enrollment
        const enroll = req.body.enroll;
        Student.findOne({enrollment:enroll},(err, result) => {
            if(result){
                Dashboard.find({issued:true,studentId:result._id}).populate('studentId').then(searchedStudent => {
                    res.render('admin/currentlyIssued',{searchedStudent:searchedStudent, foundStudents: null})
                }).catch(error => console.log(error))
            }
        })
    },
    returnBook(req, res){  //return the book when the student has returned the book
            const dashboardStudentId = req.body.studentId;
            const bookIsbn = req.body.bookIsbn;
            console.log(bookIsbn)

            if(req.body.hasOwnProperty('returnBook')){  //check for returnBook button submit
                Dashboard.findOneAndDelete({isbn: bookIsbn,studentId : dashboardStudentId}).then (result =>{
                if(result){
                    console.log(result)
                    Dashboard.countDocuments({studentId:dashboardStudentId}).then(count =>{
                        if(count == 0){
                            Student.findOneAndUpdate({_id:dashboardStudentId},{$set:{activity:"returned"}},(err, returned) =>{
                                if(returned){
                                    console.log("book is returned");
                                }else{
                                    console.log(err)
                                }
                            })
                        }
                    })
                    Book.findOneAndUpdate({isbn:bookIsbn},{$inc:{qty:1}}).then(updated => { //increase the book quantity once it is returned
                            if(updated){
                                res.redirect('/adminDashboard')
                            }
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        }
        if(req.body.hasOwnProperty('issueBook')){
            Dashboard.findOneAndUpdate({studentId:dashboardStudentId,isbn: bookIsbn},{$set:{issued:true}}).then(found => { //set the field to true once the student has issued
                if(found){
                    res.redirect('/adminDashboard')
                }
            }).catch(err => {
                console.log(err);
            })
            Book.findOneAndUpdate({isbn : bookIsbn},{$inc:{qty : -1}}).then(result =>{ // update the quantity of the book when the book is issued
                    if(result){
                        console.log('success')
                        const eventEmitter = req.app.get('eventEmitter');
                        eventEmitter.emit('getBookQty', result.qty);                        
                    }
            }).catch(err =>{
                console.log(err);
            }); 
        }
        },
        uploadExcel(req, res){
            importExcelData2MongoDB('./public' + '/excelUploads/' + req.file.filename);
            function importExcelData2MongoDB(filePath){
                // -> Read Excel File to Json Data
                var arrayToInsert = [];
csvtojson().fromFile(filePath).then(source => {
    // Fetching the all data from each row
    console.log(source)
    for (var i = 0; i < source.length; i++) {
        console.log(source[i]["name"])
         var oneRow = {
             name: source[i]["name"],
             enrollment: source[i]["enrollment"],
             standard: source[i]["standard"],
             email: source[i]["email"]
         };
         arrayToInsert.push(oneRow);
     }
     //inserting into the table “employees”
     
     Student.insertMany(arrayToInsert, (err, result) => {
         if (err) console.log(err);
         if(result){
             console.log(result)
             console.log("Import CSV into database successfully.");
             res.redirect('/')
         }
     });
});
                // const excelData = excelToJson({
                // sourceFile: filePath,
                // sheets:[{
                // // Excel Sheet Name
                // name: 'library1',
                // // Header Row -> be skipped and will not be present at our result object.
                // header:{
                // rows: 1
                // },
                // // Mapping columns to keys
                // columnToKey: {
                // A: 'name',
                // B: 'enrollment',
                // C: 'standard',
                // D: 'email'
                // }
                // }]
                // });
                // // -> Log Excel Data to Console
                // console.log(excelData);
                // // Insert Json-Object to MongoDB
                // Student.insertMany(excelData,(err,data)=>{  
                // if(err){  
                // console.log(err);  
                // }else{  
                // res.redirect('/');  
                // }  
                // }); 
                // // fs.unlinkSync(filePath);
                }
        }
    }
}
module.exports= adminController;