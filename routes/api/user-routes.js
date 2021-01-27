const router = require('express').Router();

// requiring ../../models will actually connect to index.js be default, it will always look an index file if a more specific path isn't defined ../../models/index.js
const {User} = require('../../models');

// GET/api/users
router.get('/', (req, res)=> {
    // Access our User model and run .findAll() method
    // set up the API endpoint so that when the client makes a GET request to /api/users, we will select all users from the user table in the database and send it back as JSON
    //As mentioned before, the User model inherits functionality from the Sequelize Model class. .findAll() is one of the Model class's methods. The .findAll() method lets us query all of the users from the user table in the database, and is the JavaScript equivalent of the following SQL query ... SELECT * FROM users;
    User.findAll({
        //we've provided an attributes key and instructed the query to exclude the password column It's in an array because if we want to exclude more than one, we can just add more.
        attributes: { exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});

// GET /api/users/1
// sequelize .findONe() method is equl to the sql query... SELECT * FROM users WHERE id = 1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantine', email: 'lernantindo@gmail.com', password:'password1234'} from api fetch call
    // to insert data we can use Sequelizze .create() method 
    // in SQL this command would look like ... INSERT INTO users (username, email, password) VALUES  ("Lernantino", "lernantino@gmail.com", "password1234");
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then (dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'} from request
    // if req.body has exact key/value pairs to match the model, you can just use 'req.body' instead
    // so update according to what the user put in the request body where the parameter id indicates
    //This .update() method combines the parameters for creating data and looking up data. We pass in req.body to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used.
    //The associated SQL syntax would look like the following code...
    //UPDATE users SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234" WHERE id = 1;
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        // user with id 1 is going to be 0 in the array index 
        if (!dbUserData[0]){
            res.status(404).json({message: 'No user found with that id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        // if there is data return the data in the form of json
        res.json(dbUserData);
    })
    // catch error with server
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;