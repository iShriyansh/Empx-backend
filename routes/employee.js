const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/User");
//Add employee
router.post("/", auth, (req, res) => {
     const data = {firstName,lastName, email,phone, password, roleId,} = req.body;
     
  User.updateOne(
     {email :email},  
    {$push: {"organization.employees" : data}
  },
  (err, result)=>{
    if(err){
     res.send(err);
        return;
    }
    if(result){ 
          if(result.matchedCount ==0){
            res.status(500).send({status: "failed", message: "Email does not exists!", log:result})
           return;
        }
        res.status(200).json({
          status : "success",
          message: "User added successfully!",
          log : result
      });
    }
 
    }
  )
});
//Get Employees
router.get("/:id", auth, (req, res) => {
    res.send(req.params.id)
       
});
//update employee
router.put("/", auth, (req, res) => {
res.send("updating employees");
});
//delete employee
router.delete("/", auth, (req, res) => {
res.send("deleting employees");
});




module.exports = router;