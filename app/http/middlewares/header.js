function header(req,res,next){
    var _send = res.send;
   var sent = false;
   res.send = function(data){
       if(sent) return;
       _send.bind(res)(data);
       sent = true;
   };
   next();
   };
   module.exports = header

