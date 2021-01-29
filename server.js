

const express = require('express');

//The router instance in routes/index.js (which is where this path is going) collected everything for us and packaged them up for server.js to use.
const routes = require('./routes');

//importing the connection to Sequelize from this path
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
//use the sequelize.sync() method to establish the connection to the database. The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!

//n the sync method, there is a configuration parameter { force: false }. If we change the value of the force property to true, then the database connection must sync with the model definitions and associations. By forcing the sync method to true, we will make the tables re-create if there are any association changes.

//This definition performs similarly to DROP TABLE IF EXISTS, which was used previously. This allows the table to be overwritten and re-created

// we change back to force: false so that after we are done editing and creating the tables won't be dropped everytime we re start the server 
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

//True or False? Do we need to drop the tables if we introduce changes to the model associations in Sequelize?
// true
//Yes, we do this by making Sequelize create new tables if the data model or model associations have changed by using the command sequelize.sync({force:true}) in the server.js file.

//*********************************************************************** */
//force: true is basically just resetting the table data/ clearing the data 