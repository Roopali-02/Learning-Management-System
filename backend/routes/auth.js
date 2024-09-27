const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const verifyToken = require('../middleWares/auth');


const router = express.Router();

// Register a new user
router.post('/signup',async(req,res)=>{
  const {name,email,password,role} = req.body;
  try{
    let user = await User.findOne({email});
    if(user){
      return res.status(400).json({message:'User already exists!'});
    }
    user = new User({ name, email, password, role});
    await user.save();
    const payload ={
      user:{
        id:user.id,
        role:user.role,
        name: user.name,
        email: user.email
      }
    }

    const token = jwt.sign(payload,process.env.JWT_SECRET, {
      expiresIn:'7d'
    })
    res.status(200).json({ token });
  }catch(err){
    res.status(500).send('Server error!');
  }
})

// Login a user
router.post('/login',async(req,res)=>{
   const {email,password} = req.body;
   try{
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({ message: 'Invalid credentials' });
    }
     const isMatch = await bcrypt.compare(password,user.password);
     if (!isMatch) {
       return res.status(400).json({ message: 'Invalid credentials' });
     }

     const payload = {
       user: {
         id: user.id, 
         role: user.role, 
         name: user.name,
         email: user.email
}};
     const token = jwt.sign(payload,process.env.JWT_SECRET,{
      expiresIn:'7d',
     });
     res.json({ token, user: payload.user });
   }catch(err){
     console.error('Login error:', err); // Log the error for debugging
     res.status(500).send('Server error');
   }
})

router.get('/protected', verifyToken, (req, res) => {
  // This route is now protected
  res.json({ message: 'Welcome to the protected route!', user: req.user });
});


module.exports = router;