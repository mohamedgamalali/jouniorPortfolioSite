const mongoose = require('mongoose');
const path        = require('path');
const fs        = require('fs');

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
        const error = new Error(err);
        error.httpStatusCode = 500 ;
        return next(error);       
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
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
  });

}

exports.postAddTrack=(req,res,next)=>{
  const track  = req.body.track;
  const track2 = track.trim();
  Track.findOne({trackName:track2}).then(result=>{
    if(result){
      req.flash('error','track is already exsist!');
      return res.redirect('/admin');
    }else {
      const newTrack = new Track({
        trackName:track2
      });
      newTrack.save();
      req.flash('suc','track added successfully!');
      res.redirect('/admin');
    }
  })
  .catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
  });
}
exports.postAddProject=(req,res,next)=>{
  const projectName = req.body.projectName;
  const projectDate = req.body.projectDate;
  const track       = req.body.track;
  const projectDesc = req.body.desc;
  const image       = req.file.path;
  if(!image){
    req.flash('error','image is required!!');
    return res.redirect('/admin');
  }
      const proj = new Project({
        projName:projectName,
        img:image,
        date:projectDate,
        track:mongoose.Types.ObjectId(track),
        projDes:projectDesc
      });
        proj.save().then(out=>{
          req.flash('suc','track added successfully!');
          res.redirect('/admin');
        }).catch(err=>{
          const error = new Error(err);
          error.httpStatusCode = 500 ;
          return next(error);
        })

}

exports.getEditProject=(req,res,next)=>{
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
  const projId = req.params.pId ;
  let tracks;
  Track.find({}).then(result=>{
    tracks = result;
      return Project.findById(projId)
      .populate('track')
      .exec();
  })
  .then(proj=>{
     res.render('edit-proj',{
      project:proj,
      tracks:tracks,
      flashErorr:message,
      flashSucess:message2,
      isLoggedIn:req.session.isLoggedIn
    });
  })
  .catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
  });
}

exports.postEdit=(req,res,next)=>{
  const projId      = req.body.hId;
  const projectName = req.body.projectName;
  const projectDate = req.body.projectDate;
  const image       = req.file;
  const track       = req.body.track;
  const desc        = req.body.desc;
  Project.findByIdAndUpdate(projId)
  .then(project=>{
        if(!project){
          req.flash('error','project can not be fount creat it');
          return res.redirect('/admin');
        }
        project.projName= projectName;
        project.date    = projectDate;
        project.track   = mongoose.Types.ObjectId(track);
        project.projDes = desc;
        if(image){
          clearImage(project.img);
          project.img=image.path;
        }
        return project.save();
  })
  .then(result=>{
    res.redirect('/');
  })
  .catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
  })
}

exports.postDeleteProject=(req,res,next)=>{
  const projId = req.body.projId;
  
  Project.findById(projId)
  .then(proj=>{
    clearImage(proj.img);
    return Project.findByIdAndRemove(projId);
  })
  .then(result=>{
    return res.redirect('/');
  })
  .catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
  });

}
const clearImage = filePath =>{
  filePath = path.join(__dirname +"/../"+ filePath);
  fs.unlink(filePath,err=>{console.log(err);
  });
}