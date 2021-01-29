//we'll import the elements that we'll need to build the Post model. This will include the connection to MySQL we stored in the connection.js file as well as Model and Datatypes we'll use from the sequelize package.
const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');


// create our Post Model 

class Post extends Model {}

// Now we will define the columns in the Post, configure the naming conventions, and pass the current connection instance to initialize the Post model. To do this, add the following code:

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        //this column determines who posted the news article. Using the references property, we establish the relationship between this post and the user by creating a reference to the User model, specifically to the id column that is defined by the key property, which is the primary key. The user_id is conversely defined as the foreign key and will be the matching link.
        user_id: {
            type: DataTypes.INTEGER,
            // here we are saying the the user_id should reference the 'id' of the 'user' aka primary key
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    { 
        // In the second parameter of the init method, we configure the metadata, including the naming conventions
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName:'post'
    }
);


//Lastly, we must include the export expression to make the Post model accessible to other parts of the application
module.exports = Post;

//Before we can use the Post model, we need to require it in models/index.js and export it there