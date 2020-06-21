const express = require('express');

const app = express();

app.use((req,res,next)=>{
    console.log('Hello')
    // next();
});
app.use((req,res,next)=>{
    res.send('this the next')
});

module.exports = app;