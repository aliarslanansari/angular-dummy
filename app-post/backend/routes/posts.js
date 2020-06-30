const express = require('express');
const checkAuth = require('../middlewares/check-auth');
const router = express.Router();
const multer = require('multer');
const postController = require("../controllers/posts");

const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const  isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid Mime Type");
        if(isValid){
            error = null;
        }
        cb(error, "./backend/images");
    },
    filename: (req, file, cb ) =>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
})

router.post('', checkAuth, multer({storage:storage}).single("image"),postController.createPost);
router.get('',postController.getPosts);
router.get('/:id', postController.getPost);
router.delete('/:id',checkAuth,postController.deletePost);
router.put("/:id",checkAuth,multer({ storage: storage }).single("image"), postController.updatePost);
module.exports = router

