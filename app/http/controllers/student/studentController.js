const Student = require('../../../models/student');
const Book = require('../../../models/books');

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
                res.render('student/dashboard');
            },
            issueBook(req, res){
                const issueBookId = req.body.issueBookId;
                Book.findById({_id:issueBookId},(err, foundBook) =>{
                    if(!err){
                        if(foundBook){
                            console.log(foundBook);
                            res.render('student/dashboard',{
                                title : foundBook.title, 
                                author:foundBook.author,
                                publisher:foundBook.publisher
                            });
                        }
                    }
                })
            }
        }
    }
module.exports = studentController;