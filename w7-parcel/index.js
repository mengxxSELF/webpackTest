const posts = require('./post');

posts.fetchOnePost()
    .then(post => {
        document.getElementById('title').innerHTML = post.title;
        document.getElementById('body').innerHTML = post.body;
    })
