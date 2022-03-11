const moment = require('moment')



const getPenalty = (foundBook) =>{
    let obj = [];
    var returnDate, currentDate, penalty, days_diff;
    var price = 5

    foundBook.forEach((book) =>{
        
        var chargePerBook = {
            id : " ",
            charge : ""
        }
        currentDate = moment(new Date())
        if(book.updatedAt){
           returnDate = book.updatedAt;
        }else{
            returnDate = moment(book.createdAt).add(7, 'days')
        }
        days_diff = currentDate.diff(returnDate,'days')
        penalty = days_diff * price;
        
        chargePerBook.id = book._id;
        chargePerBook.charge = penalty;
        
        obj.push(chargePerBook)
    })
    return [returnDate,obj];


}

module.exports = getPenalty;