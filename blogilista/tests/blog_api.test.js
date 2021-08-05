const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("blogs have a field 'id' defined", async () => {
  const response = await api.get("/api/blogs");
  const blog = await response.body[0];

  expect(blog.id).toBeDefined();
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);
  expect(titles).toContain(
    "React patterns",
  );
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "New blog about API:s",
    author: "Joel Hämäläinen",
    url: "http://www.API_knowhow.com",
    likes: 8,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);
  expect(titles).toContain(
    "New blog about API:s",
  );
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "Joel Hämäläinen",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("blog without likes defaults to 0", async () => {
  const newBlog = {
    title: "New blog about API:s",
    author: "Joel Hämäläinen",
    url: "http://www.diipadaapa.com",
  };

  const response = await api.post("/api/blogs").send(newBlog);

  expect(response.body.likes).toEqual(0);
});

afterAll(() => {
  mongoose.connection.close();
});
