const express = require('express');
const router = express.Router();

const authControllers = require("../Controllers/blog_controllers");
const authenticateUser = require("../middleware/authenticateUser");

router.get("/", authControllers.home);
router.get("/getBlogs", authenticateUser, authControllers.getBlogs);
router.get("/getBlog/:id", authenticateUser, authControllers.getBlogById);
router.get("/getPopular", authenticateUser, authControllers.getPopular);
router.post("/addBlog", authenticateUser, authControllers.addBlog);
router.put("/updateBlog/:id", authenticateUser, authControllers.updateBlog);
router.delete("/deleteBlog/:id", authenticateUser, authControllers.deleteBlog);

module.exports = router;