//This file, like index.js in the models folder, will serve as a means to collect all of the API routes and package them up for us.

const router = require('express').Router();

const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');


//Remember how in user-routes.js we didn't use the word users in any routes? That's because in this file we take those routes and implement them to another router instance, prefixing them with the path /users at that time/ this time...
// why are we not prefixing api/users at this time because we will do that tin the index.js file in the routes directory 
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;