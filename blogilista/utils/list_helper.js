const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const topLikes = Math.max.apply(Math, blogs.map(b => b.likes))
    const topBlog = blogs.find(blog => blog.likes === topLikes)
    return topBlog
}

const mostBlogs = (blogs) => {
    let obj = lodash.countBy(blogs, 'author')
    const topBlogger = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? {author: a, blogs: obj[a]} : {author: b, blogs: obj[b]})
    return topBlogger
}

const mostLikes = (blogs) => {
    let obj = lodash(blogs).groupBy('author').map((objs, key) => ({
        author: key,
        likes: lodash.sumBy(objs, 'likes')
    })).value();
    const topBlogger = obj.reduce((a, b) => a.likes > b.likes ? a : b )
    
    console.log(topBlogger)
    return topBlogger
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}