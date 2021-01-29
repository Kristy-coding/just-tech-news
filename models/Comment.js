// require DataTypes and Model from sequelize
// require the sequelize connection
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//initiate comment class from the sequelize Model so we ge access to all of the the methods the sequelize libaray has that will query to SQL under the hood 
class Comment extends Model {}

Comment.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comment_text: {
        type: DataTypes.STRING,
        validate: {
            // this means the comment must be at least 1 character long
            len: [1]
        }
    },
      // user_id references the primary key of the user
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            // this references the lowercase  modelName we gave the User in the modal creation
            // saying that the user_id should equal the 'id' of the 'user' aka primary key  
          model: 'user',
          key: 'id'
        }
    },
      // post_id references the primary key of the post 
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            // this references the lowercase  modelName we gave the Post in the modal creation 
            // saying that the post_id should equl the 'id' of the 'post' aka primary key
          model: 'post',
          key: 'id'
        }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
  }
);

module.exports = Comment;