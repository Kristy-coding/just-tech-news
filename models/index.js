//All this file is responsible for right now is importing the User model and exporting an object with it as a property. It seems unnecessary at the moment, but doing this now will set us up for future growth of the application.

const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// CREATE ASSOCIATIONS...


//This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//We also need to make the reverse association by adding the following statement
//In this statement, we are defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model

Post.belongsTo(User, {
    foreignKey: 'user_id',
});


//Now we need to associate User and Post to one another in a way that when we query Post, we can see a total of how many votes a user creates; and when we query a User, we can see all of the posts they've voted on. You might think that we can use .hasMany() on both models, but instead we need to use .belongsToMany()

// create the associations...
//With these two .belongsToMany() methods in place, we're allowing both the User and Post models to query each other's information in the context of a vote. If we want to see which users voted on a single post, we can now do that. If we want to see which posts a single user voted on, we can see that too

User.belongsToMany(Post, {

    //We state what we want the foreign key to be in Vote, which aligns with the fields we set up in the model.
    through: Vote,
    //We also stipulate that the name of the Vote model should be displayed as voted_posts when queried on, making it a little more informative
    as: 'voted_posts',
    foreignKey: 'user_id'
});

// ???????????????/ so according to the terminal when the table are created vote now has 2 foreign key references??? one that references post_id and one that reference user_id

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});


//By also creating one-to-many associations directly between these models, we can perform aggregated SQL functions between models
Vote.belongsTo(User, {
    foreignKey: 'user_id'
  });
  
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});


// Comment associations ...
//Note that we don't have to specify Comment as a through table like we did for Vote. This is because we don't need to access Post through Comment; we just want to see the user's comment and which post it was for

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Comment, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});








module.exports = { User, Post, Vote, Comment };



// modals are just tables 


