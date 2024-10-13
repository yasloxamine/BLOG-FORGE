//import express module
import express from "express";

//import the body parser middleware that will to parse the body of ejs to use it in the express server
import bodyParser from "body-parser";

//import the blog post array data fron data.js . wraps the array in an object (blogData), allowing reassignments since the object itself is mutable, so then later it can be modified
import { blogData } from "./data.js";

//initialize the express app
const app = express();

//declare a port to use for the app
const port = 3000;

//using the declared middleware
app.use(bodyParser.urlencoded({ extended: true }));

//use public as the main folder for static files that will be used in the web app (css,imgs...)
app.use(express.static("public"));

//get the home route using express app and render index.ejs while passing the array data and assigning it to a key named bp to the client which is index.ejs in this case
app.get("/", (req, res) => {
  res.render("index.ejs", { bp: blogData.blogPosts });
});

//rendering the PostCreation.ejs using the postCreation route assigned as href value in the header.ejs to the anchor tag <a>
app.get("/postCreation", (req, res) => {
  res.render("PostCreation.ejs");
});

//submit the form values located in the PostCreation.ejs and pushing them into the blogPosts array in order to correctly display the values in the index.ejs and rendering the index.ejs while passing the new values in the bp key in order to use them in index.ejs
app.post("/submit", (req, res) => {
  let postAuthor = req.body.PostAuthor;
  let postTitle = req.body.PostTitle;
  let postContent = req.body.PostContent;

  blogData.blogPosts.push({
    id: blogData.blogPosts.length + 1,
    author: postAuthor,
    title: postTitle,
    content: postContent,
  });

  res.render("index.ejs", { bp: blogData.blogPosts });
});


//delete the posts using the post id to delete a specific post and using the filder method to filter the posts that doesn't have the same id as the selected post
app.get("/deletePost", (req, res) => {
  // Extract the 'id' from the query string
  const postId = parseInt(req.query.id); // Convert it to a number, since post.id is a number

  blogData.blogPosts = blogData.blogPosts.filter((post) => post.id !== postId);

  res.render("index.ejs", { bp: blogData.blogPosts });
});

//post edition using req.query to get the selected post data and rendering that data in the post edition.ejs
app.get("/postEdition", (req, res) => {
  const postIdForEdition = parseInt(req.query.id);
  let postAuthorForEdition = req.query.author;
  let postTitleForEdition = req.query.title;
  let postContentForEdition = req.query.content;

  res.render("PostEdition.ejs", {
    postIdToEdition: postIdForEdition,
    postAuthorToEdit: postAuthorForEdition,
    postTitleToEdit: postTitleForEdition,
    postContentToEdit: postContentForEdition,
  });
});

//submit the modification by removing the old post that have the same id as the one being edited and then pushing a new post with the new modifications while keeping the same id number and then rendering index.ejs while passing the new blogPosts array
app.post("/submitEdition", (req, res) => {
  const oldPostIdToReplace = parseInt(req.body.PostId);

  blogData.blogPosts = blogData.blogPosts.filter(
    (post) => post.id !== oldPostIdToReplace
  );

  let postAuthor = req.body.PostAuthor;
  let postTitle = req.body.PostTitle;
  let postContent = req.body.PostContent;

  blogData.blogPosts.push({
    id: oldPostIdToReplace,
    author: postAuthor,
    title: postTitle,
    content: postContent,
  });

  res.render("index.ejs", { bp: blogData.blogPosts });
});

//listening to the declared local server port (3000)
app.listen(port, () => {
  console.log("listening on port " + port);
});
