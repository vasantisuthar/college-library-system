const Student = require('../../../models/student');
const Book = require('../../../models/books');
const Dashboard = require('../../../models/dashboard');
const moment = require('moment');

function studentController(){
    return{
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
                                        totalBooks:foundBook.totalBooks,
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
                            res.render('student/dashboard',{foundBook: foundBook, moment : moment})
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
                                Dashboard.find({title:foundBook.title,studentId:req.user._id},(err, found) =>{
                                    if(found.length == 0){
                                        if(result < 2){
                                            const dashboard = new Dashboard({
                                                studentId : req.user._id,
                                                title : foundBook.title,
                                                author : foundBook.author,
                                                isbn : foundBook.isbn
                                            })
                                            dashboard.save().then(() =>{
                                                Book.findOneAndUpdate({_id : issueBookId},{$inc:{qty : -1}},(err, result) =>{
                                                    if(err){
                                                        console.log(err)
                                                    }else{
                                                        res.redirect('/dashboard')
                                                    }
                                                });
                                                Student.findByIdAndUpdate({_id:req.user._id},{$set:{"activity":"issued"}},{upsert:true},(err, updated) =>{
                                                    console.log(updated);
                                                });
                                            }).catch(err =>{
                                                console.log(err);
                                                res.redirect('/')
                                            })
                                        }else{
                                            req.flash('issue',"Students can issue only two books")
                                            return res.redirect('/')
                                        }
                                    }else{
                                        req.flash('issue',"Book is already issued");
                                        return res.redirect('/')
                                    }
                                })      
                            }).catch(err =>{
                                console.log(err);
                                res.redirect('/')
                            })     
                        }
                    }
                })
            },
            removeIssuedBook(req, res){
                const issuedBookIsbn = req.body.issuedBookIsbn;
                Dashboard.deleteOne({isbn: issuedBookIsbn},(err, result) =>{
                    if(result){
                        Book.findOneAndUpdate({isbn : issuedBookIsbn},{$inc:{qty : 1}},(err, updated) =>{
                            if(!err){
                                if(updated){
                                    res.redirect('/');
                                }
                            }else{
                                console.log(err)
                            }
                        })
                    }
                })
            }
        }
    }
module.exports = studentController;