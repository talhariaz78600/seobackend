const express = require('express');
const router = express.Router();
const Blog = require("../../models/blogModel")

router.post("/createBlog", async (req, res) => {
    const { title, description, imageUrl,category ,home} = req.body;
    try {
        const data = new Blog({
            title: title,
            description: description,
            imageUrl: imageUrl,
            category,
            home
        })
        await data.save();
        res.status(200).json({ message: "item add successfully", data })
    } catch (error) {
        res.status(500).json({message:"Internal server error", errors:error.message})
    }

})

router.get('/getblogdata/:category', async (req, res) => {
   
    const pageNumber = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 1;
    const {category}=req.params;
    const skip = (pageNumber - 1) * pageSize;

    let stop;
    try {
        
        const finddata = await Blog.find({category:category})
            .sort({ _id: -1 })
            .skip(skip)
            .limit(pageSize)


        res.status(200).json({ finddata,skip, stop:finddata.length,message:"data fetch successfully" })


    } catch (error) {
        res.status(500).json({ errors:error.message, message:"Internal server error"})
    }
})


router.get('/getallblog', async (req, res) => {
    try {
        
        const finddata = await Blog.find()
        res.status(200).json({ finddata,message:"data fetch successfully" })


    } catch (error) {
        res.status(500).json({ errors:error.message, message:"Internal server error"})
    }
})
router.get("/getsingleblog/id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Blog.findOne({ _id: id });
        if (!data) {
          return  res.status(400).json({ message: 'blog not found' })
        }
  
        res.status(200).json({ message: "blog fetch successfully", data })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})


router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description,category} = req.body;
    try {
        const data = await Blog.findOne({ _id: id });
        if (!data) {
          return  res.status(400).json({ message: 'blog not found' })
        }
        if (title) {
            data.title = title;
        }
        if (description) {
            data.description = description;
        }
        if(home){
            data.home=home;
        }
        if(category){
            data.category=category;
        }
        await data.save();
        res.status(200).json({ message: "blog successfully updated", data })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})


router.delete('/deleteBlog/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let data = await Blog.findOne({ _id: id });
        if (!data) {
          return res.status(400).json({ message: "Blog not found" })
        }
        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: "blog successfully deleted", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

router.put('/createComment/:blogId', async (req, res) => {
    const { blogId } = req.params;
    const { name, comment, email } = req.body;
    try {
        const data = await Blog.findOne({ _id: blogId });
        if (!data) {
          return  res.status(400).json({ message: "blog not found" })
        }
        data.comments.push({
            name: name,
            comment: comment,
            email: email
        })
        await data.save();
        res.status(200).json({ message: "comment successfully added", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

router.put('/deleteComment/:blogId', async (req, res) => {
    const { blogId } = req.params;
    try {
        let data = await Blog.findOne({ _id: blogId });
        if (!data) {
            return res.status(400).json({ message: "blog not found" })
        }
        data.comments= data.comments.filter((item) => item._id.toString() != blogId);
        await data.save();
        res.status(200).json({ message: "comment successfully deleted", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error",errors:error.message});
    }
})
module.exports = router;
