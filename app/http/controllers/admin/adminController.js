const Book = require('../../../models/books');
function adminController(){
    return{
        addbooks(req, res){
            res.render('admin/addBooks');
        },
        postBooks(req, res){
            const {title, author, edition} = req.body;
            const book = new Book({
            title,
            author,
            edition,
            published,
            isbn,
            publisher,
            qty
            })
            book.save().then((book) =>{
                return res.redirect('/')
            })
            .catch(err =>{
                req.flash('error',"something went wrong")
                return res.redirect('/add');
            })
        }
    }
}
module.exports= adminController;