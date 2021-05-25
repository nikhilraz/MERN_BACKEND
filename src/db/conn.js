const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/userRegistrationForm",{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,useUnifiedTopology:true})
.then(()=>{console.log("DB connection successful")})
.catch((err)=>{
    console.log(err);
});