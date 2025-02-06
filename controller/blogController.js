const moment = require('moment');
const blogModel = require('../models/blogModel');
const cloudinary = require("cloudinary");

const add_blog = async (req, res) => {

    try {
        const { blogTitle } = req.body

        if (!blogTitle) {
            return res.json({
                message: 'Blog title is required',
                error: true,
                success: false
            });
        }

        const lowerCaseBlogTitle = blogTitle.trim().toLowerCase();
        const slug = lowerCaseBlogTitle.split(' ').join('-');


        const uploadBlog = new blogModel({
            blogTitle: blogTitle.trim(),
            slug: slug,
            date: moment().format('LL'),
            ...req.body,
        }
        )
        const saveBlog = await uploadBlog.save();

        res.status(201).json({
            message: "Blog upload successfull",
            error: false,
            success: true,
            data: saveBlog
        });
    } catch (error) {
        console.error('Error parsing form:', error);
        res.status(400).json({
            message: 'Error parsing form',
            error: true,
            success: false
        });
    }
};

const get_blog = async (req, res) => {
    try {
        const allBlog = await blogModel.find().sort({ createdAt: -1 })

        return res.status(200).json({
            message: "All Blogs",
            success: true,
            error: false,
            data: allBlog
        })
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
};

const update_blog_status = async (req, res) => {
    const { blog_id } = req.params
    const { status } = req.body

    const updatedStatus = await blogModel.findByIdAndUpdate(blog_id, { status }, { new: true })
    return res.status(200).json({ message: 'Blog status update success', updatedStatus })

};

const delete_Blog = async (req, res) => {

    const { blog_id } = req.params;

    try {
        const blog = await blogModel.findById(blog_id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (Array.isArray(blog.blogImage)) {
            for (let img of blog.blogImage) {
                let public_id = "";

                // If serviceIcon is an object with public_id
                if (typeof img === "object" && img.public_id) {
                    public_id = img.public_id;
                }
                // If serviceIcon is a URL, extract public_id
                else if (typeof img === "string" && img.includes("cloudinary.com")) {
                    const parts = img.split("/");
                    public_id = parts[parts.length - 1].split(".")[0];
                }

                // Delete image from Cloudinary
                if (public_id) {
                    await cloudinary.v2.uploader.destroy(public_id);
                }
            }
        }

        await blogModel.findByIdAndDelete(blog_id);

        return res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error("Error deleting Blog:", error);
        return res.status(500).json({ message: 'Internal blog error' });
    }
};

const get_categorywise_blog = async (req, res) => {

    try {
        const { blog_id } = req.params

        const blog = await blogModel.findById(blog_id);
        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found',
                error: true,
                success: false
            });
        }
        res.status(201).json({
            message: "All Blogs",
            error: false,
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

const update_categorywise_blog = async (req, res) => {

    try {
        const { blogTitle, blogImage, description } = req.body;
        const existBlog = await blogModel.findById(req.params.blog_id);

        if (!existBlog) {
            return res.status(404).json({ success: false, error: true, message: 'Blog not found' });
        }

        if (!blogTitle || !blogImage || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const oldImages = existBlog.blogImage || [];
        const removedImages = oldImages.filter(img =>
            !blogImage.some(newImg => newImg.public_id === img.public_id)
        );

        for (let img of removedImages) {
            if (img.public_id) {
                await cloudinary.v2.uploader.destroy(img.public_id);
            }
        }

        existBlog.blogTitle = blogTitle;
        existBlog.slug = blogTitle.trim().toLowerCase().split(' ').join('-');
        existBlog.blogImage = blogImage;
        existBlog.description = description;

        await existBlog.save();

        res.json({
            success: true,
            error: false,
            message: 'Blog updated successfully',
            existBlog,
        });
    } catch (error) {
        console.error("Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};



// For website
const get_blog_for_website = async (req, res) => {
    try {
        const allBlog = await blogModel.find().sort({ createdAt: -1 })

        return res.status(200).json({
            message: "All Blog",
            success: true,
            error: false,
            data: allBlog
        })
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const get_single_blog_for_website = async (req, res) => {

    const { slug } = req.query;

    try {
        const singleBlog = await blogModel.findOne({ slug: slug });

        if (!singleBlog) {
            return res.status(404).json({
                message: "Blog not found",
                success: false,
                error: true,
            });
        }


        return res.status(200).json({
            message: "Get Blog",
            success: true,
            error: false,
            data: singleBlog
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};





module.exports = {
    add_blog,
    get_blog,
    update_blog_status,
    delete_Blog,
    get_categorywise_blog,
    update_categorywise_blog,
    get_blog_for_website,
    get_single_blog_for_website
};
