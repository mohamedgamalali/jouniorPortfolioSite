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
  console.log(err);
});
 
  Project.find({})
    .sort({date: -1})
    .limit(6)
    .populate('track')
    .exec()
    .then(result=>{
      res.render('index',{
      pageTitle:'projects',
      pagePath:'/projects',
      tracks:tracks,
      projects:result,
      count:0,
      isLoggedIn:req.session.isLoggedIn
    });
  })
  .catch(err=>{
    console.log(err);
  })
  // res.render('index',{
  //   pageTitle:'projects',
  //   pagePath:'/projects',
  //   tracks:tracks
  // });
}

exports.getContactMe=(req,res,next)=>{
  let tracks = null ;
Track.find({}).then(result=>{
    tracks = result ;

}).catch(err=>{
  console.log(err);
});
  res.render('contactme',{
    pageTitle:'contact Me',
    pagePath:'/contactme',
    tracks:tracks,
    isLoggedIn:req.session.isLoggedIn
  });
}

exports.getAboutme=(req,res,next)=>{
  let tracks = null ;
Track.find({}).then(result=>{
    tracks = result ;

}).catch(err=>{
  console.log(err);
});
  res.render('aboutme',{
    pageTitle:'About Me',
    pagePath:'/aboutme',
    tracks:tracks,
    isLoggedIn:req.session.isLoggedIn
  });
}
exports.getTrack=(req,res,next)=>{
  let tracks = null ;
Track.find({}).then(result=>{
    tracks = result ;

}).catch(err=>{
  console.log(err);
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
            console.log(err);
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
    console.log(err);
  })

}
