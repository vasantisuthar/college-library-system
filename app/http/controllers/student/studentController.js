const Student = require('../../../models/student');
const Book = require('../../../models/books');

function studentController(){
    return{
        dashboard(req, res){
            console.log(typeof req)
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
        }
    }
}
module.exports = studentController;