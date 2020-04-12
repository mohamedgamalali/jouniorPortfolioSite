const mongoose = require('mongoose');

const Project = require('../models/projects');
const Track = require('../models/tracks');

// let tracks = null ;
// Track.find({}).then(result=>{
//     tracks = result ;

// }).catch(err=>{
//   console.log(err);
// });


exports.getHome=(req,res,next)=>{
  let tracks = null ;
Track.find({}).then(result=>{
    tracks = result ;

}).catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
});
 
  Project.find({})
    .sort({date: -1})
    .limit(6)
    .populate('track')
    .exec()
    .then(result=>{
      res.render('index',{
      pageTitle:'JR. - Visual Artist, Graphic Designer.',
      pagePath:'/projects',
      tracks:tracks,
      projects:result,
      count:0,
      isLoggedIn:req.session.isLoggedIn
    });
  })
  .catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
  })
  // res.render('index',{
  //   pageTitle:'projects',
  //   pagePath:'/projects',
  //   tracks:tracks
  // });
}

exports.getContactMe=(req,res,next)=>{
Track.find({}).then(result=>{
  return res.render('contactme',{
    pageTitle:'JR. - Contact Me',
    pagePath:'/contactme',
    tracks:result,
    isLoggedIn:req.session.isLoggedIn
  });
}).catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
});
  
}

exports.getAboutme=(req,res,next)=>{
  
Track.find({}).then(result=>{
    return res.render('aboutme',{
      pageTitle:'JR. - About Me',
      pagePath:'/aboutme',
      tracks:result,
      isLoggedIn:req.session.isLoggedIn
    });

}).catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
});

 
}
exports.getTrack=(req,res,next)=>{
  let tracks = null ;
Track.find({}).then(result=>{
    tracks = result ;

}).catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
});
  const trackId = mongoose.Types.ObjectId(req.params.track);
  let total = 0 ;

   Project.find({track:trackId})
   .countDocuments()
   .then(count=>{
      total = count ;
      return  Project.find({track:trackId})
      .populate('track')
      .exec()
      .then(result=>{
        if(result.length===0){
          Track.findById(trackId).then(ree=>{
            res.render('track',{
              pageTitle:ree.trackName,
              pagePath:'/'+ree.trackName,
              tracks:tracks,
              projects:[],
              count:0,
              isLoggedIn:req.session.isLoggedIn,
              base:0
            });
          }).catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500 ;
            return next(error);
          })
        }else {
          console.log(result);
          let base = 0 ;
          if(total%2==0){
               base =total/2; 
          }else{
            base = Math.floor(total/2)+1;
          }
          res.render('track',{
            pageTitle:result[0].track.trackName,
            pagePath:'/'+result[0].track.trackName,
            tracks:tracks,
            projects:result,
            count:0,
            base:base,
            isLoggedIn:req.session.isLoggedIn
          });
        }
      })
   })
  .catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500 ;
    return next(error);
  })

}
