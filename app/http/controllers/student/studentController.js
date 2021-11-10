const Student = require('../../../models/student');
const Book = require('../../../models/books');

function studentController(){
    return{
        dashboard(req, res){
            if(req.body.hasOwnProperty('deleteButton')){
            console.log("dashborad route")
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
                Book.find({title:selectedTitle}, (err, foundBook) => {
                    if(foundBook){
                        res.render('book',{foundBook : foundBook});
                    }
                })

                
            
        }
    }
}
module.exports = studentController;