const express =require('express');
const app = express();
const passport = require('passport')
app.use(passport.initialize());
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var data={};
const cloudinary = require('cloudinary')
var bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
const upload =require('./route/multer')




passport.use(new GoogleStrategy({
  clientID: '273380332739-hjs8th2t2e42nv67ad4vnkf6cpd1ljtf.apps.googleusercontent.com',
  clientSecret: 'VNFPHuE3LhmsibBBumaK1xy2',
  callbackURL: "http://localhost:8000/auth/google/callback" },
  
  (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    
    data["Name"]=profile.displayName
    data["Image"]=profile._json.picture
    done(null, profile);
  }
  
));
passport.serializeUser((user, done) => {
  done(null, user);
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
  
}));



app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  
  res.send("<center><h1>Welcome To My Site "+data.Name+"</h1><img src="+data.Image+"></img></center>")
  
});


cloudinary.config({ 
  cloud_name: 'coder-404', 
  api_key: '334571629886163', 
  api_secret: '-D82BH02mo23NfUWH3ovgtbe6Vo' 
});




app.use('/cloud',cloud=express.Router());
require('./cloud')(cloud,cloudinary)

app.use('/',login=express.Router());
require('./route/login')(login,upload,cloudinary)

// app.use('/',express=express.Router());
// require('./models/mysql')(express)

app.listen(8000,()=>{
    console.log('running....');
    
})