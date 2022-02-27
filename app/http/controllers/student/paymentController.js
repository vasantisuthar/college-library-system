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
              amount: 2000,
              currency: "usd",
              source: "tok_mastercard", // obtained with Stripe.js
              description: "My First Test Charge (created for API docs)"
            }, {
              idempotencyKey: "797MuvCWKGmZvKwT"
            }, function(err, charge) {
              // asynchronously called
              // student paid charge  
              Dashboard.findByIdAndUpdate({_id:bookId},{$set:{"charge":null}},{upsert:true},(err, done)=>{
                if(done){
                  res.redirect('/dashboard');
                }else{
                  console.log(err)
                }
              })
  
                // If no error occurs
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
