const Dashboard = require('../../../models/dashboard');
const stripe = require('stripe')(process.env.secret_key);

const PaymentController = () =>{
    return{
        postRequestForPayment(req, res){
          const charge = req.body.bookCharge
          const bookId = req.body.bookId
          console.log(charge)
          try{  
              stripe.charges.create({
              amount: charge,
              currency: "inr",
              source: "tok_mastercard", // obtained with Stripe.js
              description: "My First Test Charge (created for API docs)"
            }, function(err, found) {
              // asynchronously called
              // student paid charge  
              const date = new Date();
              console.log("current date is " ,date);
              Dashboard.findByIdAndUpdate({_id:bookId},{$set:{"charge":null, "pay": charge,"updatedAt": date}},(err, done)=>{
                if(done){
                  res.redirect('/dashboard');
                }else{
                  console.log(err)
                }
              })
            })
          .catch((err) => {
            console.log(err)       // If some error occurs
          });
        }catch(err){
          res.send(err);
        }
      }
    }
  }

module.exports = PaymentController;
