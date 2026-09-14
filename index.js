import express from "express";
// import { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";

const app = express();
const port = 7777;

// middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// interface Post {
//   id: number,
//   date: Date
//   author: string,
//   title: string,
//   content: string
// }

let posts = [
  {
    id: 1,
    date: new Date(),
    author: "root",
    title: "My First Post",
    content: "Hello! This is my first post on this site!",
  },
  {
    id: 2,
    date: new Date(),
    author: "root",
    title: "My Second Post",
    content: "Hello! This is my second post on this site!",
  },
];

// Homepage (posts display)
app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

app.get("/edit/:id", (req, res) => {
  if (req.params.id == "new")
    res.render("editor.ejs", {
      post: { id: posts.length + 1, title: "New Post", content: "" },
    });
  // check if given post id exists
  else if (!posts.some((post) => post.id == Number(req.params.id)))
    res.send(`Error: Invalid post id '${req.params.id}'`);
  // set id to either the requested id or the next available one
  else res.render("editor.ejs", { post: posts[Number(req.params.id) - 1] });
});

app.post("/submit-post", (req, res) => {
  const constructed_post = {
    id: req.body.id,
    date: new Date(),
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
  };
  console.log(constructed_post);

  if (constructed_post.author === undefined) {
    res.send("Error: Cannot submit with no author");
  }
  else if (constructed_post.title === undefined) {
    res.send("Error: Cannot submit with no title");
    return;
  } else if (constructed_post.content === undefined) {
    res.send("Error: Cannot submit with no post content");
    return;
  }

  if (posts.some((post) => post.id == req.body.id)) {
    posts[constructed_post.id - 1] = constructed_post;
  } else {
    posts.push(constructed_post);
  }

  res.redirect("/");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
