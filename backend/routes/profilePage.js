const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router()
const User = require('../models/userInfo');

//ROUTE 1: User Creation
router.post('/createuser',[
    body('name','Enter a valid user name.').isLength({min:3}),
    body('email','Enter a valid user email.').isEmail(),
    body('pnum',"Phone number must be 10 digits long.").isLength({min:10,max:10}),
    body('location').isString()
],async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
        //Checks if user already exists
        let user = await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({error:"Sorry a user with this email already exists"})
        }
        //Create and Save user to database.
        user = await User.create({
            name:req.body.name,
            email:req.body.email,
            pnum:req.body.pnum,
            location:req.body.location
        })
        res.json({Success:"Added into the database."});
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error."})
    }
});

//ROUTE 2: Update User Info
router.put('/updateuser',async (req,res)=>{
    const {name,email,pnum,location} = req.body;
    const newUser = {};

    if(name){newUser.name=name};
    if(email){newUser.email=email};
    if(pnum){newUser.pnum=pnum};
    if(location){newUser.location=location};

    let user = await User.findOne();
    if(!user){
        res.status(404).json({message:"No user found in the database."});
    }
    user = await User.findOneAndUpdate({},newUser,{new:true});
    res.json({Success:"User Info Updated Successfully.",updatedUser:user});
});

//ROUTE 3: Fetch User Info
router.get('/getuser',async (req,res)=>{

    try {
        //Fetching user
        const user = await User.findOne();
        if(!user){
            return res.status(404).json({message:"No user found in the database."});
        }
        
        const userInfo = {
            name:user.name,
            email:user.email,
            pnum:user.pnum,
            location:user.location
        }
        res.json(userInfo)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error."})
    }
});

module.exports = router;