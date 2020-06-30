const Post = require('./../models/post');

exports.createPost = (req, res) => {
    url = req.protocol+'://'+req.get('host');
    const post = new Post ({
        title:req.body.title,
        content:req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    })
    console.log(post)
    post.save().then((results)=>{
        res.status(201).json({
            message: 'Post Added Successfully',
            post:{
                ...results,
                id:results._id
            }
        });
    })
    .catch(error=>{
        res.status(500).json({
            message:'Creating a post failed!'
        });
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = {
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userIds
    };
    Post.updateOne({ _id: req.params.id,creator:req.userData.userId }, post).then(result => {
        if(result.nModified>0){
          res.status(200).json({ message: "Update successful!" });
        }else{
          res.status(401).json({ message: "Not Authorised" });
        }
    })
    .catch(error=>{
      res.status(500).json({
          message:"Couldn't update the post!"
      });
  });
}

exports.getPosts = (req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery.skip((currentPage-1)*pageSize)
        .limit(pageSize);
    }
    postQuery.then((documents)=>{
        fetchedPosts = documents;
        return Post.countDocuments();
    }).then(count=>{
        res.status(200).json({
            message:'Succesfully fetched',
            posts:fetchedPosts,
            maxPosts:count
        });
    })
    .catch(error=>{
        res.status(500).json({
            message:"Couldn't fetch the post!"
        });
    });
}

exports.getPost = (req, res,next) => {
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
    .catch(error=>{
        res.status(500).json({
            message:"Couldn't fetch the post!"
        });
    });
}

exports.deletePost = (req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id:req.params.id, creator:req.userData.userId}).then(result=>{
        console.log(result);
        if(result.n>0){
            res.status(200).json({ message: "Update successful!" });
          }else{
            res.status(401).json({ message: "Not Authorised" });
        }
    })
    .catch(error=>{
        res.status(500).json({
            message:"Couldn't Delete the post!"
        });
    });
}