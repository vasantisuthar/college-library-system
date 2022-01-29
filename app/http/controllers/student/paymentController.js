const Dashboard = require('../../../models/dashboard');

const PaymentController = () =>{
    return{
        postRequestForPayment(req, res){
              console.log("from post request for payment")
              stripe.customers.create({
              email: req.body.stripeEmail,
              source: req.body.stripeToken,
            })
            .then((customer) => {
              res.redirect('/');
                return stripe.charges.create({
                currency: 'INR',
                customer: customer.id
                
            });
          })
          .then((charge) => {
            // student paid charge  
            console.log(charge)
            // Dashboard.findByIdAndUpdate({_id:singleObj.id},{$set:{"charge":null}},{upsert:true},(err, done)=>{
            //   if(done){
            //     console.log("updated charge to null");
            //     res.redirect('/');
            //   }else{
            //     console.log(err)
            //   }
            // })

              // If no error occurs
          })
          .catch((err) => {
            res.send(err)       // If some error occurs
          });
      }
    }
  }

module.exports = PaymentController;
