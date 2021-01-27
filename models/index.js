//All this file is responsible for right now is importing the User model and exporting an object with it as a property. It seems unnecessary at the moment, but doing this now will set us up for future growth of the application.

const User = require('./User');
const Post = require('./Post');

// create associations
//This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//We also need to make the reverse association by adding the following statement
//In this statement, we are defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model

Post.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Post };
