const express=require('express');
const hbs=require('hbs');
const bcrypt=require('bcryptjs');
const path=require('path');
const app=express();
require('dotenv').config()
const port=process.env.PORT||9000;
require('./db/conn');
const Employee=require("./models/Employee");

const viewPath=path.join(__dirname,"../templates/views");
const staticPath=path.join(__dirname,"../public");
const partialsPath=path.join(__dirname,"../templates/partials");
app.set('view engine',"hbs");
app.set('views',viewPath);
hbs.registerPartials(partialsPath);
app.use(express.static(staticPath));

//for postman
app.use(express.json());
//for form
app.use(express.urlencoded({extended:false}));


console.log(process.env.SECRET_KEY);


app.get('/',async (req,res)=>{
    res.render("index");
});
app.get('/register',async(req,res)=>{
    res.render('register');
});
//create a new user in db
app.post('/register',async(req,res)=>{
    try {
        const content=req.body;
        if(req.body.password===req.body.confirmPassword){
            const newEmployee=new Employee({
                fname:content.fname,
                lname:content.lname,
                email:content.email,
                gender:content.gender,
                phone:content.phone,
                age:content.age,
                password:content.password,
                confirmPassword:content.confirmPassword
            });
            const token=await newEmployee.generateAuthToken();
            console.log(token);
            const result=await newEmployee.save();
            res.status(201).render("index");
        }
        else{
            res.status(400).send("Password didn't match");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/login',async(req,res)=>{
    res.render('login');
});
app.post('/login',async(req,res)=>{
    try {
        const emp=await Employee.findOne({email:req.body.email});
        const dbPassword=emp.password;
        const matchPassword=await bcrypt.compare(req.body.password,dbPassword);
        if(matchPassword) {
            const token=await emp.generateAuthToken();
            console.log(token);
            res.render('index');
        }
        else{
            res.render('login');
        }       
    } catch (error) {
        res.status(400).send("Invalid login details");
    }
});
app.listen(port,()=>{
    console.log("Server is listening at port "+port);
});