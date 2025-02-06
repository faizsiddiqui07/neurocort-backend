const express = require('express')
const { add_blog, get_blog, get_blog_for_website, update_blog_status, get_categorywise_blog, update_categorywise_blog, get_single_blog_for_website, delete_Blog } = require('../controller/blogController')
const router = express.Router()


router.post('/api/blog/add_blog', add_blog)
router.get('/api/allBlog', get_blog)
router.put('/api/blog/status-update/:blog_id', update_blog_status)
router.delete('/api/deleteBlog/:blog_id', delete_Blog);
router.get('/api/blog/:blog_id', get_categorywise_blog);
router.put('/api/updateBlog/:blog_id', update_categorywise_blog);



// For website 
router.get('/api/allBlogForWebsite', get_blog_for_website)
router.get('/api/singleBlog', get_single_blog_for_website)



module.exports = router