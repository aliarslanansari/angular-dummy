const express = require('express');

const app = express();

app.use('/api/posts',(req,res,next)=>{
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
    res.status(200).json({
        message:'Succesfully fetched',
        post:posts
    });
});

module.exports = app;