const express = require("express");
const {check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/User");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post("/signup",[
    check("firstName", "firstName required").not().isEmpty(),
      check("lastName", "lastName required").not().isEmpty(),
    check("email", "Please enter a Valid Email").isEmail(),
 
    check("password", "Please enter a Valid Password").isLength({min: 6})
],
async(req, res) => {
 const errors = validationResult(req);
 //check params validation
 if(!errors.isEmpty()){
     return res.status(400).json({errors: errors.array()});
 }

 //destructure the params
 const {firstName,lastName, email,phone, password, roleId, organization} = req.body;

 //check for existing user

   try{
     //search if email already exists
     let user  = await User.findOne({email});
     if(user){
         return res.status(400).json({errors: [{msg: "User already exists"}]});
     }

     user =  new User({
         firstName,
         lastName,
         phone,
         email,
         password,
         organization,
         roleId :{id:roleId}
     })

//      bcryptjs
// This library will be used to hash the password and then store it to database.This way even app administrators can't access the account of a user.
    
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);

await user.save();

const payload = {
    user: {
        id:user.id
    }
}

  jwt.sign(
      payload,
     "randomString", {
         expiresIn:1000
     },
     
     (err,token) =>{
         if(err) throw err;
         res.status(200).json({
           user,
             token
         })
     }


    )

    
    
    }catch(err){

  
  console.log(err.message);
            res.status(500).send("Error in Saving");

     }


});



router.post("/login",[
    check("email", "Please enter a valid email.").isEmail(),
    check("password", "Please enter valid password").isLength({min:6})
],

async(req,res)=>{
    const errors = validationResult(req);
    
    //validation
    if(!errors.isEmpty){
return res.status(400).json({errors:errors.array()})
    }
   
    const {email,password} =  req.body;

   //Check user data in the database

   try{
      let user = await User.findOne({
        email
      });

       if(!user){
         return res.status(400).json({"message": "User not found!"})

       }
       const isMatch = await bcrypt.compare(password, user.password);
       if(!isMatch){
           return res.status(400).json({
            "message": "Incorrect password!"
           })
       }
       const payload = {
           user :{"id":user.id}
       }

       jwt.sign(
          payload,
          "randomString",
            {
          expiresIn: 3600
        },

        (err,token)=>{
          if(err)throw err;
          
          res.status(200).json({user,token})
        }



       )

   }
   catch(e){
    console.error(e);
      res.status(500).json({
        message: "Server Error",
        "error":e,
      });
   }


}

)
/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/me",auth, async(req,res)=>{
//! request.user is getting fetched from Middleware after token authentication
  try{
    const user = await User.findById(req.user.id);
    res.json(user);
  }
  catch(e){
    res.send({message:"Error in Featching user"});
  }
})



module.exports = router;