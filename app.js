const express      = require('express');
const bodyParser   = require('body-parser');
const path         = require('path');
const mongoose     = require('mongoose');
const session      = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash        = require('connect-flash');
const multer       = require('multer');
const csrf         = require('csurf');
const User = require('./models/user');
const Visit = require('./models/visit');

const app         = express();

//ejs meddlewere
app.set('view engine', 'ejs');
app.set('views', 'views');

const MONGODB_URI =
  'mongodb+srv://mohamed:gamal@cluster0-puljc.mongodb.net/jounior';

  //multer
  var storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
    cb(null,new Date().toISOString()+'-' + file.originalname)
    }})

    var checkImage=function(file,cb){
      var ext=path.extname(file.originalname);     
      if(ext==='.png'||ext==='.jpg'||ext==='.jpeg'){
          cb(null,true)
      }else{
          cb('not an image',false)
      }
      }
      
      
      var upload=multer({
          storage:storage,
          fileFilter:function(req,file,cb){
              checkImage(file,cb)
          }
      })
      
      app.use(upload.single('image'));

  //mongoose session store
  const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
  });


//routes
const mainRout    = require('./routes/main');
const adminRout    = require('./routes/admin');
const authRout    = require('./routes/auth');

//bodyParser & static Files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

//mongo session meddlewere
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store:store
  })
  );

  //csrf protection 
const csrfProtection = csrf();

app.use(csrfProtection);
app.use((req,res,next)=>{
  res.locals.csrfToken = req.csrfToken();
  next();
});

  //visits meddlewere
  app.use((req,res,next)=>{
    
    if(!req.session.seen){
      Visit.find()
      .then(reult=>{
        let result = reult;
        
        result[0].counter+=1;
        result[0].save();
        req.session.seen = true ;
        next();
      })
      .catch(err=>{
        console.log(err);
        
      });
    }else{
      next();
    }
  });
  
  app.use(flash());

app.use(mainRout);
app.use('/admin',adminRout);
app.use(authRout);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});
                                /*error handeling*/
    const errorContriller = require('./controllers/errors');
    // app.use('/500',errorContriller.get500);
    
    // app.use((err,req,res,next)=>{
    //   res.redirect('/500');
    // })
    
    app.use(errorContriller.get404);
mongoose
.connect(
  MONGODB_URI,{
      useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false }
)
  .then(result => {
    app.listen(5000,()=>{
      console.log('connected to DB and listen... ');
    });
  })
  .catch(err => {
    console.log(err);
  });
