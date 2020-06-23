const express = require('express');
const Post = require('./../models/post');
const router = express.Router();
const multer = require('multer');
const MIME_TYPE_MAP={
    'image.png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const  isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid){
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb ) =>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ext);
    }
})

router.post('', (req, res,next) => {
    const post = new Post ({
        title:req.body.title,
        content:req.body.content
    })
    console.log(post)
    post.save().then((results)=>{
        res.status(201).json({
            message: 'Post Added Successfully',
            postId:results._id
        });
    });
});

router.get('',(req,res,next)=>{
    Post.find().then(documents=>{
        res.status(200).json({
            message:'Succesfully fetched',
            posts:documents
        });
    })
});

router.get('/:id', (req, res,next) => {
    Post.findById(req.params.id)
    .then(post=>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(400).json({
              message:'Post not found'  
            });
        }
    })
});

router.delete('/:id',(req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log(result);
        res.status(200).json({ message:'Post Deleted' });
    })
});

router.put('/:id', (req, res) => {   
    const post = new Post ({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content
    })
    Post.updateOne({_id:req.params.id},post).then(result=>{
        console.log(result);
        res.status(200).json({ message:'Post Edited' });
    })
});

module.exports = router
