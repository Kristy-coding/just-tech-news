// This file will contain all of the user-facing routes, such as the homepage and login page.



const router = require('express').Router();


//In the api/post-routes.js file, we already have a Sequelize Post.findAll() query set up to return all posts and their nested properties. We'll use this same query to populate the homepage template.First, import the necessary modules and models into home-routes.js...
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

//Previously, we used res.send() or res.sendFile() for the response. Because we've hooked up a template engine, we can now use res.render() and specify which template we want to use. In this case, we want to render the homepage.handlebars template (the .handlebars extension is implied)
router.get('/', (req, res)=> {
    console.log(req.session);
    //The res.render() method can accept a second argument, an object, which includes all of the data you want to pass to your template
    //Notice that this object mimics what we will ultimately get from Sequelize
    //In this case, we're going to take a single "post" object and pass it to the homepage.handlebars template
    //Each property on the object (id, post_url, title, etc.) becomes available in the template using the Handlebars.js {{ }} syntax.
    // res.render('homepage', {
    //     id: 1,
    //     post_url: 'https://handlebarsjs.com/guide/',
    //     title: 'Handlebars Docs',
    //     created_at: new Date(),
    //     vote_count: 10,
    //     comments: [{}, {}],
    //     user: {
    //       username: 'test_user'
    //     }
    //   });
    Post.findAll({
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
          // pass a single post object into the homepage template
          //console.log(dbPostData[0]);
          //The data that Sequelize returns is actually a Sequelize object with a lot more information attached to it than you might have been expecting. To serialize the object down to only the properties you need, you can use Sequelize's get() method
          //You didn't need to serialize data before when you built API routes, because the res.json() method automatically does that for you
          //....res.render('homepage', dbPostData[0].get({ plain: true}));
          // above we're only accommodating one post. We need the entire array of posts to be in the template. That also means we'll need to serialize the entire array
          //.map() each Sequelize object into a serialized version of itself, saving the results in a new posts array
          //Now we can plug that array into the template. However, even though the render() method can accept an array instead of an object, that would prevent us from adding other properties to the template later on. To avoid future headaches, we can simply add the array to an object and continue passing an object to the template.
          // dbPostData is an array, we can .map() each post in the array of posts and run the .get() method to serialize the data from each request
          //dbPostData.map(post => post.get({ plain: true }));
          // we will set this new array that is returned from .map() = to posts
          // so const posts = an array of serialized posts  
          const posts = dbPostData.map(post => post.get({ plain: true }));
          // add the posts array to an object and send it as an arguent to render
          // handles bar can loop over this array with {{#each block}}
          //Within the {{#each}} block, Handlebars.js is smart enough to know that it's working with an object on each iteration 
          // We can make this a little clearer, however, by declaring a variable name in the {{#each}} expression and using that name for the subsequent placeholders
          res.render('homepage', { posts });

        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
    });


});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    //Our login page doesn't need any variables, so we don't need to pass a second argument to the render() method.
    res.render('login')
});

module.exports = router;