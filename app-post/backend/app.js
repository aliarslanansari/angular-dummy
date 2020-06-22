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

const posts = [
    {
        id: 'q2323',
        title: 'First Post',
        content: '1 post'
    },
    {
        id: 'q1123',
        title: 'Second Post',
        content: '2 post'
    },
    {
        id: 'q2322',
        title: 'Third Post',
        content: '3 post'
    },
]

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false }));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, PUT, OPTIONS')
    next(); 
});

app.post('/api/posts', (req, res,next) => {
    const post = new Post ({
        title:req.body.title,
        content:req.body.content
    })
    console.log(post)
    post.save();
    posts.push(post);    
    res.status(201).json({
        message: 'Post Added Successfully'
    })
});

app.get('/api/posts',(req,res,next)=>{
    Post.find().then(documents=>{
        res.status(200).json({
            message:'Succesfully fetched',
            posts:documents
        });
    })
   
});

module.exports = app;