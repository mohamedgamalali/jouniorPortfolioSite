const express     = require('express');
const bodyParser  = require('body-parser');
const path        = require('path');
const mongoose    = require('mongoose');
const session     = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash       = require('connect-flash');
const multer = require('multer');
const User = require('./models/user');
const Visit = require('./models/visit');

let visitsCoun = 0;
const app         = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const MONGODB_URI =
  'mongodb+srv://mohamed:gamal@cluster0-puljc.mongodb.net/jounior';

  const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
  });

  const fileStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,__dirname + '/images');
  },
  filename:(req,file,cb)=>{
    cb(null,new Date().toISOString() + '-' +file.originalname );
  }

});

const fileFilter = (req,file,cb)=>{
  if(file.mimetype === 'image/png'||file.mimetype === 'image/jpg'||file.mimetype === 'image/jpeg'){
    cb(null,true);
  }else {
    cb(null,false);
  }

}

const mainRout    = require('./routes/main');
const adminRout    = require('./routes/admin');
const authRout    = require('./routes/auth');

const path1 = path.resolve();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(path1, 'public')));
app.use('/images',express.static(path.join(path1, 'images')));


app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store:store
  })
  );
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
    

mongoose
.connect(
  MONGODB_URI,{
      useNewUrlParser: true,useUnifiedTopology: true}
)
  .then(result => {
    app.listen(5000,()=>{
      console.log('connected to DB and listen... ');
    });
  })
  .catch(err => {
    console.log(err);
  });
