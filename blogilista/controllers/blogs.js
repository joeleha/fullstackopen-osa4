const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try { 
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try { 
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = await request.body

  const updatedBlog = {
    likes: body.likes
  }

  try {
    const b = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    response.json(b)
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter