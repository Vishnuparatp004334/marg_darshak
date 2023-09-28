const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const keysecret = "mynameisvishnusinghrajput12345"
var bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validator(value){
            if (!validator.isEmail(value)) {
                throw new Error("not valid email")
            }
        }
    },
    phone:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
        minlength:6
    },
    cpassword:{
        type:String,
        required: true,
        minlength:6
    },
    date:{
       type:Date,
       default:Date.now
    },
    messages:[
      {
        fname:{
            type:String,
            required: true,
            trim:true
        },
        email:{
            type:String,
            required: true,
        },
        phone:{
            type:Number,
            required: true,
            trim:true
        },
        whnumber:{
            type:Number,
            required: true,
            trim:true
        },
        expert:{
            type:String,
            required: true,
            trim:true
        },
        problem:{
            type:String,
            required: true,
            trim:true
        },
      }
    ],
    tokens:[
        {
            token:{
                type:String,
                require:true,
            }
        }
    ]

})

// token generate----------------------------------------------------
// generating auth token
userSchema.methods.generateAuthToken = async function(){
    try {
     const token = jwt.sign({_id:this._id},  keysecret,{
        expiresIn:"1d"
     });
     this.tokens = this.tokens.concat({token:token})
     await this.save();
     return token;
     
    } catch (error) {
     console.log("the error part" + error);
    }
}
// storing messages-------------------------------------------------
userSchema.methods.addMessage = async function(fname,email,phone,whnumber,expert,problem){
    console.log(fname,email,phone,whnumber,expert,problem);
    try {
        this.messages = this.messages.concat({fname,email,phone,whnumber,expert,problem});
        await this.save();
        return this.messages
    } catch (error) {
        console.log(" error hai baby");
    }
}
// converting password into hash
userSchema.pre("save", async function(next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

const userdb = new mongoose.model("users", userSchema);

module.exports = userdb;