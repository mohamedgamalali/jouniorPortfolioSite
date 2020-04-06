const mongoose = require('mongoose');
const path        = require('path');

const Project = require('../models/projects');
const Track = require('../models/tracks');
const Visit = require('../models/visit');

exports.getAdmin=(req,res,next)=>{
  let seen    = 0 ;
  Visit.find()
      .then(reult=>{
        seen = reult[0].counter;
      })
      .catch(err=>{
        console.log(err);       
      });
  let tracks=[] ;
  Track.find({}).then(result=>{
      tracks = result ;
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
      Project.find({})
      .countDocuments()
      .then(count=>{
        res.render('admin',{
          pageTitle:'admin',
          pagePath:'/admin',
          tracks:tracks,
          flashErorr:message,
          flashSucess:message2,
          isLoggedIn:req.session.isLoggedIn,
          count:count,
          seen:seen
        });
      });
  }).catch(err=>{
    console.log(err);
  });

}

exports.postAddTrack=(req,res,next)=>{
  const track  = req.body.track;
  const track2 = track.trim();
  Track.findOne({trackName:track2}).then(result=>{
    if(result){
      req.flash('error','track allready existng!...');
      return res.redirect('/admin');
    }else {
      const newTrack = new Track({
        trackName:track2
      });
      newTrack.save();
      req.flash('suc','track added successfully!!');
      res.redirect('/admin');
    }
  })
  .catch(err=>{
    console.log(err);
  });
}
exports.postAddProject=(req,res,next)=>{
  const projectName = req.body.projectName;
  const projectDate = req.body.projectDate;
  const track       = req.body.track;
  const projectDesc = req.body.desc;
  const image       = req.file.path;
  console.log(image+"   "+ track +"  "+projectDate);
  if(!image){
    req.flash('error','image is required!!');
    return res.redirect('/admin');
  }
      const proj = new Project({
        projName:projectName,
        img:'/'+image,
        date:projectDate,
        track:mongoose.Types.ObjectId(track),
        projDes:projectDesc
      });
        proj.save().then(out=>{
          req.flash('suc','track added successfully!!');
          res.redirect('/admin');
        }).catch(err=>{
          console.log(err);
        })

}
