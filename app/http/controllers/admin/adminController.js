const Book = require('../../../models/books');
const Student = require('../../../models/student');
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
            
        }
    }
}
module.exports= adminController;