const Blog = require("../models/blog");
const escapeStringRegexp = require('escape-string-regexp');
const { createClient } = require('redis');


const redisClient = createClient({
    password: 'nnBgvj4JbozDfNlP8VXBCNanDhos5FYz',
    socket: {
        host: 'redis-19577.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 19577
    }
});

(async () => {
    await redisClient.connect();
})();

redisClient.on("connect", () => console.log("Redis client connected"));
redisClient.on("error", (err) => console.log("Redis client connection error", err));


const home = (req, res) => {

    res.json({ "Greetings": "Welcome to MyBlog.in" });

};

const getBlogs = async (req, res) => {

    try {
        const searchText = req.query.search;
        let blogs;
        if (searchText) {
            const $regex = escapeStringRegexp(searchText.toString());
            blogs = await Blog.find({ title: { $regex } });
        }
        else {
            blogs = await Blog.find();
            const data = await redisClient.keys('*');
            // const jsonData = JSON.parse(data);
            // console.log(jsonData);
            console.log(data);
        }
        return res.status(200).json(blogs);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ messsage: "Internal server error." });
    }
};


const getBlogById = async (req, res) => {

    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "blog not found." });
        }
        let id = req.params.id;
        let count = await redisClient.get(id)
        if (count == null) {
            count = 0
        }
        else {
            value = Number(count) + 1;
            count = value.toString();
        }

        redisClient.set(id, count);

        if (count > 5) {
            console.log("Here");
            const update = await Blog.findByIdAndUpdate(
                id,
                { $set: {popular : "true"} },
            );
            console.log(update);
        }

        return res.status(200).json(blog);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

};

const getPopular = async (req, res)=>{
    try {
        const blogs = await Blog.find({popular : "true"});
        res.status(200).json(blogs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const addBlog = async (req, res) => {

    try {

        const {
            title, author, content
        } = req.body;

        if (!title || title.length === 0 || !author || author.length === 0 || !content || content.length === 0) {
            return res.status(400).json({ message: "Enter valid data" });
        }

        const newBlog = new Blog({
            title, author, authorId: req.userId, content, date: new Date().toLocaleDateString()
        });
        const addedBlog = await newBlog.save();
        return res
            .status(200)
            .json({ message: "Blog added.", addedBlog });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const updateBlog = async (req, res) => {
    try {
        const {
            title, author, content
        } = req.body;

        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }

        console.log(req.userId, blog.authorId);

        if (req.userId != blog.authorId) {
            return res.status(401).json({ message: "You are unauthorized to perform this operation." });
        };


        const updatedBlog = {};
        if (title) {
            updatedBlog.title = title;
        }
        if (author) {
            updatedBlog.author = author;
        }
        if (content) {
            updatedBlog.content = content;
        }

        const update = await Blog.findByIdAndUpdate(
            req.params.id,
            { $set: updatedBlog },
            { new: true }
        );
        res
            .status(200)
            .json({ message: "Blog updated successfully.", update });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error." });
    }

};

const deleteBlog = async (req, res) => {

    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(400).json({ message: "Blog not found." });
        }

        if (req.userId != blog.authorId) {
            return res.status(401).json({ message: "You are unauthorized to perform this operation." });
        };

        blog = await Blog.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Blog deleted." });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { home, getBlogs, getBlogById, getPopular, addBlog, updateBlog, deleteBlog };


