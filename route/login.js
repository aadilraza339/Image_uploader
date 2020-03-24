const path = require('path')
var bodyParser = require("body-parser");
var knex=require('../models/mysql')
module.exports = (app,upload,cloudinary) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  
 
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/first.html'));
  });
  
  app.post('/add', (req, res) => {
    knex('user')
      .insert({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email
    })
    .then((data) => {
      res.sendFile(path.join(__dirname + '/template/login.html'));
    })
    .catch((err) => {
      res.send(err)
    })
  });
  
  app.post('/auth',(req,res)=>{
        var name = req.body.username
        knex
        .select('*').from('user').where('user.email',req.body.username)
        .then((data)=>{
          // res.send(data)
            if(data.length === 0){
                res.send("<center><h1> check your email </h1>")
            }
            else{
                if (data[0]['password'] === req.body.password){
                  // console.log(data[0]['name']);
                 
                    const token =jwt.sign({"name":data[0]['name']}, "aadil")
                    // console.log(token)
                    knex('image')
                    .select('user_url','name','caption')
                    .where('name',data[0]['name'])
                    .then((data)=>{
                      res.cookie(token)
                      res.sendFile(path.join(__dirname+'/template/image.html'),{'data':data},token)})
                    .catch((err)=>{
                      res.send(err)
                    })
                   
                   

                }
                else {
                    res.send("<center><h1> check your Password </h1>")
                }
              
            }
        })
        .catch((err)=>{
            res.send(err)
        })
    })
  
    app.post('/myaction',upload.single('image'),async(req,res)=>{
          cloudinary.v2.uploader.upload(req.file.path, 
            function(error, result) {
              if (!error){
                  knex('image')
                  .insert({user_url:result['url'],
                  name:auth_data.name,
                  caption:req.body.name})
                    .then(()=>{
                         res.send(result);
                         console.log(result['url']);
                })
              }else{
                res.send(error)
              }
        })
    })


    app.get('/image',(req,res)=>{
        knex('image')
        .select('user_url')
        .where('name',auth_data.name)
        .then((data)=>{
          res.send(data)
          })
          .catch((err)=>{
            res.send(err)
          })
    })
}

