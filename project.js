const express = require('express');
const session = require('express-session');
const { v4:uuidv4} = require("uuid");
const mongoose = require('mongoose');
const User = require('./models/user');
const user = require('./models/user');


require('dotenv').config();


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized: true
}));

app.set('view engine','ejs')

mongoose.connect(
    process.env.DB_ADD,
    { useNewUrlParser: true},
    ()=> console.log('connected to DB')
);


app.get('/',(req,res) => {
    res.render(__dirname+'/views/login.ejs', {status:''})
})

app.get('./views/login.html',(req,res) => {
    res.sendFile(__dirname+'/views/login.html')
})


app.get('/register', (req,res) =>{
    res.render(__dirname+'/views/register.ejs', {status:''})
})

app.post('/registerUser', async (req,res)=>{
    const user = new User ({
        name:req.body.name,
        password:req.body.password
    });
    try {
        const savedUser = await user.save()
        //res.send(savedUser)
        res.render(__dirname+'/views/login.ejs', {status:"User succesfully registered."})

    } catch{
        res.status(400).send(err)
    }
})

app.post('/users', (req, res) => {
    try{
        const user = {name:req.body.name, password: req.body.password}
        users.push(user)
        res.status(201).send()
    }
    catch{
        res.status(500).send()
    }
})

app.post('/users/login', async (req,res) => {
  
    try{
        const user_id = await user.findOne({ name: req.body.username }).exec();
        
        if (user_id != null &&  req.body.password == user_id.password){     
            req.session.user = req.body.username
            res.redirect('/dashboard')
        } 
       else{
            
           res.render(__dirname+'/views/login.ejs', {status:"Incorrect Username or password."})
        }
    } catch(err) {
        res.json({message: err.message});
    }
})

app.get('/dashboard', (req, res) => {
    if(req.session.user){
        res.render(__dirname+'/views/main.ejs', {status:""})
    }else{
        res.end("Unauthorized User")
    }
})


app.get('/users/logout', (req,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }else{
            res.render(__dirname+'/views/login.ejs', {status:"Logged out succesfully."})
        }
    })
})


app.listen(8000)
