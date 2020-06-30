const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const path = require('path');
const mongoose = require('mongoose');
const config = {
    autoIndex:          false,
    useUnifiedTopology: true,
    useNewUrlParser:    true,
};

const DB_URL = "mongodb+srv://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_ATLAS_PW+"@mongoali-qcgnw.mongodb.net/"+process.env.MONGO_DB_NAME;
console.log(DB_URL);
// "mongodb://localhost:27017/posts-angular"
mongoose.connect(DB_URL,config)
.then(()=>{
    console.log('Connnected to Database!')
})
.catch(err => console.log(err));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false }));

app.use('/images',express.static(path.join('backend/images')));


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, PUT, OPTIONS')
    next(); 
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
module.exports = app;