
const PaymentController = () =>{
    return{
        postRequestForPayment(req, res){

            // Moreover you can take more details from user
            // like Address, Name, etc from form
            stripe.customers.create({
              email: req.body.stripeEmail,
              source: req.body.stripeToken,
            })
            .then((customer) => {
                return stripe.charges.create({
                currency: 'INR',
                customer: customer.id
            });
          })
          .then((charge) => {
            // student paid charge  
            res.send("Success")  // If no error occurs
          })
          .catch((err) => {
            res.send(err)       // If some error occurs
          });
      }
    }
  }

module.exports = PaymentController;
