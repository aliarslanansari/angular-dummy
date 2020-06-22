const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Post = require('./models/post')
const mongoose = require('mongoose');
const config = {
    autoIndex:          false,
    useUnifiedTopology: true,
    useNewUrlParser:    true,
};
mongoose.connect("mongodb://localhost:27017/posts-angular",config)
.then(()=>{
    console.log('Connnected to Database!')
})
.catch(err => console.log(err));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false }));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, PUT, OPTIONS')
    next(); 
});

app.post('/api/posts', (req, res,next) => {
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

app.get('/api/posts',(req,res,next)=>{
    Post.find().then(documents=>{
        res.status(200).json({
            message:'Succesfully fetched',
            posts:documents
        });
    })
});

app.get('/api/posts/:id', (req, res) => {
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

app.delete('/api/posts/:id',(req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log(result);
        res.status(200).json({ message:'Post Deleted' });
    })
});

app.put('/api/posts/:id', (req, res) => {
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

module.exports = app;