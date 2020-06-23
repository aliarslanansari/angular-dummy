const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const postsRoutes = require('./routes/posts')
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

app.use(express.static(__dirname + '/images'));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, PUT, OPTIONS')
    next(); 
});

app.use('api/posts', postsRoutes);
app.use("/api/posts", postsRoutes);


module.exports = app;