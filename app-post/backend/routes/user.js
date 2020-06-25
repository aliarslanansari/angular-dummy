const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/signup',(req,res, next)=>{
    bcrypt.hash(req.body.password, 10)
    .then(hash=>{
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save().then((result)=>{
            res.status(201).json({
                message:'User Created',
                result:result
            })
        })
        .catch((err)=>{
            res.status(500).json({
                error: err
            })
        });
    });
});

router.post('/login', (req, res) => {
    User.findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            return res.status(401).json({
                message:"Auth failed"
            });
        }
        return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message:"Auth failed"
            });
        }
    })
    .catch(err=>{
        return res.status(401).json({
            message:"Auth failed"
        });
    })
});
module.exports = router;    