const Student = require('../../../models/student');
const Book = require('../../../models/books');
const Dashboard = require('../../../models/dashboard');

function studentController(){
    return{
        dashboard(req, res){
            if(req.body.hasOwnProperty('deleteButton')){
            const selectedBook = req.body.selectedBook;
            console.log(selectedBook);
            Book.deleteOne({_id : selectedBook},(err)=>{
                if(!err){
                    res.redirect('/');
                }else{
                    console.log(err);
                }
            })
            }
        },
        getBook(req, res){
                const selectedTitle = req.params.title;
                if(selectedTitle){
                    Book.findOne({title:selectedTitle}, (err, foundBook) => {
                    if(err){
                        console.log(err)
                    }else{
                            Book.find({publisher:{$regex:foundBook.publisher, $options:"$i"}},(err, relatedBook) =>{
                                if(err){
                                    console.log(err);
                                }else{
                                    if(relatedBook){
                                        res.render('book',
                                        {title:foundBook.title,
                                        author:foundBook.author,
                                        edition:foundBook.edition,
                                        isbn:foundBook.isbn,
                                        publisher:foundBook.publisher,
                                        published:foundBook.published,
                                        qty:foundBook.qty,
                                        bookId:foundBook._id,
                                        relatedBook: relatedBook})
                                    }
                                    
                                }
                        })
                    }
                })
                }
            },
            getDashboard(req, res){
                Dashboard.find({studentId: req.user._id},null,{sort: {'createdAt': -1}},(err, foundBook) =>{
                    if(!err){
                        if(foundBook){
                            res.render('student/dashboard',{foundBook: foundBook})
                        }
                    }
                })
            },
            issueBook(req, res){
                const issueBookId = req.body.issueBookId;
                Book.findById({_id:issueBookId},(err, foundBook) =>{
                    if(!err){
                        if(foundBook){
                            Dashboard.countDocuments({studentId:req.user._id}).then((result) =>{
                                if(result < 2){
                                    const dashboard = new Dashboard({
                                        studentId : req.user._id,
                                        title : foundBook.title,
                                        author : foundBook.author,
                                        publisher : foundBook.publisher
                                    })
                                    dashboard.save().then(() =>{
                                        Book.findOneAndUpdate({_id : issueBookId},{$inc:{qty : -1}},(err, result) =>{
                                            if(err){
                                                console.log(err)
                                            }else{
                                                res.redirect('/dashboard')
                                            }
                                        });
                                    }).catch(err =>{
                                        console.log(err);
                                        res.redirect('/')
                                    })
                                }else{
                                    req.flash('issue',"Students can issue only two books")
                                    return res.redirect('/')
                                }
                            }).catch(err =>{
                                console.log(err);
                                res.redirect('/')
                            })     
                        }
                    }
                })
            }
        }
    }
module.exports = studentController;