const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const employeeSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

employeeSchema.methods.generateAuthToken=async function(){
    try {
        const token=await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token});
        return token;
    } catch (error) {
        res.send("error part is "+ error);
    }
};
//middleware
employeeSchema.pre('save',async function(next){
    if(this.isModified("password")){
        console.log("the current password is "+this.password);
        this.password=await bcrypt.hash(this.password,10);
        console.log("the current password is "+this.password);
         this.confirmPassword=undefined; 
   }
    next();
});

const Employee=new mongoose.model("Employee",employeeSchema);
module.exports=Employee;