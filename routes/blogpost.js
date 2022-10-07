const express = require("express");
const router = express.Router();
const Post = require("../models/blog");
const auth = require("../middleware/auth");
const Blog = require("../models/blog");

router.post("/create-blog", auth, async (req, res) => {
  const { title,subtitle, content, image, category } = req.body;
  const newPost = new Post({
    title,
    content,
    image,
    category,
    subtitle,
    postedBy: req.user._id,
  });

  try {
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// getting all the blogs

router.get("/all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().populate(
      "postedBy",
      "_id username displayPic"
    );

    return res.status(200).json(blogs.reverse());
  } catch (e) {
    return res.status(400).send(e);
  }
});

// full blog

router.get("/all-blogs/:id", async (req, res) => {
  const id=req.params.id
  try {
    const blog = await Blog.findById(id).populate(
      "postedBy",
      "_id username displayPic"
    );

    return res.status(200).json(blog);
  } catch (e) {
    return res.status(400).send(e);
  }
});



//searching by category

router.get("/blogs",  async (req, res) => {
  const query = req.query.category;
  if (query === "All") {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } else {
    try {
      const blogs = await Blog.find({
        category: {
          $eq: query,
        },
      }).populate("postedBy", "_id username displayPic");
      res.status(200).json(blogs.reverse());
    } catch (e) {
      res.status(400).send(e);
    }
  }
});
//searching by title
// FIX:
router.get("/search", auth, async (req, res) => {
  const keyword = req.query.title
    ? {
        $or: [
          { title: { $regex: req.query.title, $options: "i" } },
          { content: { $regex: req.query.title, $options: "i" } },
        ],
      }
    : {};

  const blogs = await Blog.find(keyword).populate('postedBy','_id username displayPic');
  res.send(blogs);
});

// my  blogs
router.get("/my-blog", auth, async (req, res) => {
  const blogs = await Blog.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id  username email displayPic"
  );
  try {
    res.status(200).json(blogs);
  } catch (e) {
    res.status(400).send(e);
  }
});

//delete blogs

router.post("/remove-blog", auth, async (req, res) => {
  Blog.findByIdAndDelete(req.body.blogId, {
    new: true,
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

//comment on blog
router.put("/comment", auth, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.blogId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id username")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/edit", auth, async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.body.blogId, {
    $set: {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      category: req.body.category,
    },
  });
  try {
    return res.status(200).json(blog);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
