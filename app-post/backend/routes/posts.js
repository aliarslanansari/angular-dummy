const express = require('express');
const checkAuth = require('../middlewares/check-auth');
const router = express.Router();
const postController = require("../controllers/posts");
const extractFile = require('../middlewares/file')

router.post('', checkAuth, extractFile,postController.createPost);
router.get('',postController.getPosts);
router.get('/:id', postController.getPost);
router.delete('/:id',checkAuth,postController.deletePost);
router.put("/:id",checkAuth, extractFile, postController.updatePost);
module.exports = router