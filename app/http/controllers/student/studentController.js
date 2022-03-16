const {Student} = require('../../../models/student');
const Book = require('../../../models/books');
const {Dashboard} = require('../../../models/dashboard');
const getPenalty = require('../../../config/penalty.js')
const moment = require('moment');

function studentController(){
    return{
        getBook(req, res){
                const selectedId = req.params.id;
                if(selectedId){
                    Book.findOne({_id:selectedId}, (err, foundBook) => {
                    if(err){
                        console.log(err)
                    }else{
                        if(foundBook){
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
                                        moment:moment,
                                        relatedBook: relatedBook})
                                        const eventEmitter = req.app.get('eventEmitter');
                                        eventEmitter.emit('getBookQty', foundBook.qty);     
                                    }
                                    
                                }
                            })
                        }
                    }
                })
                }
            },
            getDashboard(req, res){
                const publishable_key = process.env.publishable_key;
                Dashboard.find({studentId: req.user._id},null,{sort: {'createdAt': -1}}, (err, foundBook) =>{
                    Student.findOne({_id:req.user._id},async (err, result)=>{
                        if(foundBook){
                            if(result){
                                const charges = getPenalty(foundBook);
                                const returnDate =  charges[0];
                                const obj = charges[1];
                                if(moment().isAfter(returnDate)){
                                        var done = false;
                                        obj.forEach(async (singleObj) => {
                                            const updated = await Dashboard.findByIdAndUpdate({_id:singleObj.id},{$set:{"charge":singleObj.charge}},{upsert:true})
                                                if(updated){
                                                    done = true;
                                                }else{
                                                    console.log(err)
                                                }
                                        });
                                    }
                                    await res.render('student/dashboard',{foundBook: foundBook, moment : moment, returnDate : returnDate, result:result, key : publishable_key, done:done})
                                }
                            }else{
                                console.log(err)
                            }
                        }
                    )
                    })
                
            },
            issueBook(req, res){
                const issueBookId = req.body.issueBookId;
                Book.findOne({$and:[{_id:issueBookId},{qty:{$gt:0}}]},(err, foundBook) =>{
                    if(!err){
                        if(foundBook){
                            Dashboard.countDocuments({studentId:req.user._id}).then((result) =>{
                                Dashboard.find({bookId:foundBook._id,studentId:req.user._id},(err, found) =>{
                                    if(found.length == 0){
                                        if(result < 2){
                                            const dashboard = new Dashboard({
                                                studentId : req.user._id,
                                                bookId: foundBook._id,
                                                title : foundBook.title,
                                                author : foundBook.author,
                                                isbn : foundBook.isbn
                                            })
                                                dashboard.save().then(() =>{
                                                Student.findByIdAndUpdate({_id:req.user._id},{$set:{"activity":"issued"}},{upsert:true},(err, updated) =>{
                                                    if(updated){
                                                        return res.redirect('/dashboard')
                                                    }
                                                });
                                                
                                            }).catch(err =>{
                                                console.log(err);
                                                // return res.redirect('/')
                                            })
                                        }else{
                                            req.flash('issue',"Student can issue only two books")
                                            return res.redirect('/');
                                        }
                                        
                                    }else{
                                        req.flash('issue',"Book is already issued");
                                        return res.redirect('/')
                                    }
                                })      
                            }).catch(err =>{
                                console.log(err);
                                return res.redirect('/')
                            })     
                        }else if(!foundBook){
                            req.flash('issue',"Book is not available")
                            return res.redirect('/')
                        }
                    }
                })
            },
            removeIssuedBook(req, res){
                const issuedBookIsbn = req.body.issuedBookIsbn;
                    Dashboard.findOneAndRemove({isbn: issuedBookIsbn},(err, result) =>{
                        if(result){
                            Dashboard.countDocuments({studentId: req.user._id}).then((count) =>{
                                if(count == 0){
                                    Student.findOneAndUpdate({_id:req.user._id},{$set:{activity:"returned"}},(err, returned) =>{
                                        if(returned){
                                            console.log("returned")
                                            
                                        }else{
                                            console.log(err)
                                        }
                                    })
                                }
                            })
                        

                        Book.findOneAndUpdate({isbn : issuedBookIsbn},{$inc:{qty : 1}},(err, updated) =>{
                            if(!err){
                                if(updated){
                                    res.redirect('/');
                                }
                            }else{
                                console.log(err)
                            }
                        })
                    }else{
                        console.log(err)
                    }
                })
        }
    }
}
module.exports = studentController;