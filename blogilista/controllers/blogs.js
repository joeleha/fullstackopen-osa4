const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleWare = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post("/", middleWare.tokenExtractor, middleWare.userExtractor, async (request, response) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: request.user._id,
  });

  const savedBlog = await blog.save();
  request.user.blogs = request.user.blogs.concat(savedBlog._id);
  await request.user.save();
  return response.json(savedBlog.toJSON());
});

blogsRouter.delete("/:id", middleWare.tokenExtractor, middleWare.userExtractor, async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === request.user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  }
  return response.status(400).json({ error: "No permission to do that" });
});

blogsRouter.put("/:id", async (request, response) => {
  const body = await request.body;

  const updatedBlog = {
    likes: body.likes,
  };
  const b = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
  });
  response.json(b);
});

module.exports = blogsRouter;
