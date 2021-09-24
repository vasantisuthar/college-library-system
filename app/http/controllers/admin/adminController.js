function adminController(){
    return{
        addbooks(req, res){
            res.render('admin/addBooks');
        }
    }
}
module.exports= adminController;