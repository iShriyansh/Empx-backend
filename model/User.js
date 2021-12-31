const mongoose = require("mongoose");

const Coordinates =  {
      latitude: Number,
      longitude: Number
    }

const Address  = {
 
    country: String,
    state: String,
    city: String,
    postalCode: String,
    address: String,
    coordinates:Coordinates,
  
  
}

const BasicUserDetails = {
  firstName: {
    type: String,
    required: true
  },
  lastName:{
   type:String,
   required:true
  },

  email: {
    type: String,
    required: true
  },
  phone:{
    type : Number,
    required:true
  },
  password: {
    type: String,
    required: true
  },
  roleId : {
    id:Number,
      changedAt: {
    type: Date,
    default: Date.now()
      }

  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
}



const OrganizationSchema = new mongoose.Schema({
    name: {
    
      type:String,
    },
    email: {
      type:String,
    },
    domain : String,
    address : Address,

    website:String,
    employees : [
     BasicUserDetails
  ]
  
});



const UserSchema = mongoose.Schema({
  
  ...BasicUserDetails,
  organization : OrganizationSchema
  

});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);