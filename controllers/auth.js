const mongoose = require('mongoose');
const path        = require('path');
const bcrypt    = require('bcryptjs');

const User = require('../models/user');
const Track = require('../models/tracks');

let tracks = null ;
Track.find({}).then(result=>{
    tracks = result ;

}).catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
});

// bcrypt.hash('500500500',12)
//       .then(hashedPassword=>{
//         const user = new User({
//           email:'test@test.com',
//           password:hashedPassword,
//         });
//         user.save();
//       }).catch(err=>{
//           console.log(err);
          
//       });

exports.getLogin = (req,res,next)=>{
    let message = req.flash('error');
      if(message.length>0){
        message = message[0];
      }else {
        message = null;
      }
      let message2 = req.flash('suc');
      if(message2.length>0){
        message2 = message2[0];
      }else {
        message2 = null;
      }
    res.render('login',{
        tracks:tracks,
        flashErorr:message,
        flashSucess:message2
    });
}

exports.getlogOut = (req,res,next)=>{
  req.session.destroy(err => {
    if(err){
      const error = new Error(err);
      error.httpStatusCode = 500 ;
      return next(error);
    }
    res.redirect('/');
  });
}

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const pass  = req.body.password;

    User.findOne({email:email})
    .then(result=>{
        if(!result){
            req.flash('error','Email not Found!!..');
            return res.redirect('/login');
        }else{
            bcrypt.compare(pass,result.password)
            .then(isMatch=>{
                if(!isMatch){
                    req.flash('error','Wrong password!!');
                    return res.redirect('/login');
                }else{
                    req.session.isLoggedIn = true ;
                    req.session.user = result ;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/admin');
                      });
                }
            })
            .catch(err=>{
              const error = new Error(err);
              error.httpStatusCode = 500 ;
              return next(error);
            })
        }
    })
    .catch(err=>{
      const error = new Error(err);
      error.httpStatusCode = 500 ;
      return next(error);
        
    });
    
    
}