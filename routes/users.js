/*var express = require('express');
var router = express.Router();

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;*/
const mongoose=require('mongoose');
const plm=require('passport-local-mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/pin");
const userSchema= new mongoose.Schema({
  username:{
    type:String,
    require:true,
    unique:true
  },
  password:{
    type:String
    
  },
  posts:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:'Post'
  }],
  dp:{
    type:String,

  },
  email:{
    type:String,
    required:true
  },
  fullname:{
    type:String,
    required:true
  },
  profileImage:{
    type:String
  },
});
  
userSchema.plugin(plm);
module.exports=mongoose.model('User',userSchema);
