const Dashboard = require('../../../models/dashboard');
const stripe = require('stripe')(process.env.secret_key);

const PaymentController = () =>{
    return{
        postRequestForPayment(req, res){
          try{
              stripe.customers.create({
              email: req.body.stripeEmail,
              source: req.body.stripeToken,
            })
            .then((customer) => {
                stripe.charges.create({
                amount:
                currency: 'INR',
                customer: customer.id
            });
          })
          .then(() => {
            // student paid charge  
            Dashboard.findByIdAndUpdate({_id:singleObj.id},{$set:{"charge":null}},{upsert:true},(err, done)=>{
              if(done){
                console.log("updated charge to null");
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
