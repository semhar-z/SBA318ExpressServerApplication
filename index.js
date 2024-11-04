const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const itemsRouter = require('./routes/itemsRouter.js');
const { items } = require('./data/form.js');
const users = require("./routes/users");
const posts = require("./routes/posts");
const commentsRouter = require("./routes/comments.js");
const methodOverride = require('method-override');
const comments = require("./data/comments.js");
const error = require("./utilities/error");

const app = express();
const PORT = 3000;

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const images = [
    { id: 1, src: 'image1.jpg', description: 'Image 1' },
    { id: 2, src: 'image2.jpg', description: 'Image 2' },
    { id: 3, src: 'image3.jpg', description: 'Image 3' }
];

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/comments", commentsRouter);
app.use('/api/items', itemsRouter);

// Render the index page with links to users, posts, comments and items
app.get('/', (req, res) => {
    console.log("Comments data type:", Array.isArray(comments) ? "Array" : typeof comments); 
    console.log("Comments content:", comments);
    res.render('index', { 
        items, 
        comments: comments || [],
        links: [
            { href: '/api/users', rel: 'users', type: 'GET' },
            { href: '/api/posts', rel: 'posts', type: 'GET' },
            { href: '/api/comments', rel: 'comments', type: 'GET' },
            { href: '/api/items',  rel: 'items', type: 'GET'},
            { href: '/api/images', rel: 'images', type: 'GET'}
        ]
    });
});

// Adding HATEOAS links
app.get("/api", (req, res) => {
  res.json({
    links: [
      { href: "/api/users", rel: "users", type: "GET" },
      { href: "/api/users", rel: "users", type: "POST" },
      { href: "/api/posts", rel: "posts", type: "GET" },
      { href: "/api/posts", rel: "posts", type: "POST" },
      { href: "/api/comments", rel: "comments", type: "GET" },
      { href: "/api/comments", rel: "comments", type: "POST" }
    ]
  });
});

// Route to render the images page
app.get('/api/images', (req, res) => {
    res.render('images', { images }); 
});

// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

app.use((err, req, res, next) => {
    console.error(err); // Log the error details for debugging
    res.status(err.status || 500);
    res.json({ error: err.message });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
