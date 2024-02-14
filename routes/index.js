var express = require('express');
var router = express.Router();
const userModel=require('./users');
const postModel=require('./posts');
const passport=require('passport');
const upload=require('./multer');
 
//userlogin
const localStrategy=require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login',{error:req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

//profile image upload
router.post('/fileupload',isLoggedIn, upload.single('image'), async function(req, res, next) {
  const user=await userModel.findOne({
    username:req.session.passport.user});
    user.profileImage=req.file.filename;
    await user.save();
    res.redirect("/profile");

});

//user upload his new pics
  router.post('/upload',isLoggedIn, upload.single('file'), async function(req, res, next) {
  if(!req.file){
    return res.status(404).send('No files were uploaded.');
  }
  const user=await userModel.findOne({
  username:req.session.passport.user});
    const postdata=await postModel.create({
      image:req.file.filename,
      imageText:req.body.filecaption,
      user:user._id
    })
    user.posts.push(postdata._id);
    await user.save();
    res.send("done");
  
});
//profile page
router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user=await userModel.findOne({
    username:req.session.passport.user
    //firstname:req.session.passport.user
  })
  .populate("posts")
  

  res.render('profile',{user});
});

// 1>register user
router.post('/register',function(req,res){
  const userData= new userModel({
    username:req.body.username,
    email:req.body.email,
    fullname:req.body.fullname
  });
  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile");
    })
  })
});

// 2>login if user is alredy register
router.post('/login', passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
failureFlash:true
    }),function(req,res){
  });

  // 3>logout page if user enter wrong password
  router.get("/logout", function(req,res){
    req.logout(function(err){
      if(err){
        return next(err);}
        res.redirect('/');
    });
  })
   function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
  }


module.exports = router;
