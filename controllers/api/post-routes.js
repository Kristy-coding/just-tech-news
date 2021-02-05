//include packages and models that we'll need to create the Express.js API endpoints


const router = require('express').Router();
const sequelize = require('../../config/connection');

// authguard middleware to all non GET routes
const withAuth = require('../../utils/auth');

// this will grab the /models.index.js by default 
// we need to require Post and User models 
//In a query to the post table, we would like to retrieve not only information about each post, but also the user that posted it. With the foreign key, user_id, we can form a JOIN, an essential characteristic of the relational data model
const {Post, User, Vote, Comment} = require('../../models');

// get all posts
// GET /api/posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
      // Query configuration
      // attributes specifies which coloumns in the Post modale we want to select (created_at is given to us by sequelize)
      // next we'll include the JOIN to the User table. We do this by adding the property include, as shown in the following code... this property takes in an array so that if we needed to we could join information from multiple tables aka make mulitple JOIN statements
      attributes: ['id', 'post_url','title', 'created_at',   [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
      // order by post recent posts
      order: [['created_at', 'DESC']],
      include: [
           // include the Comment model here:
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
  
});

//GET /api/posts/:id
router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'post_url', 'title', 'created_at',[sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
      include: [
        // include the Comment model here:
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
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// POST /api/posts
router.post('/', withAuth,(req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1} from request body
    Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      // originally we passed in the user Id from insomnia to test his routes... now this request is being made from a front-end form.
      //user_id: req.body.user_id
      //The user wiil not know their id, but we can get the id from the session
      user_id: req.session.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
 });

 // PUT /api/posts/upvote
 // this route needs to be defined before router.put('/:id')***Otherwise Express.js will think the word "upvote" is a valid parameter for /:id
 //An upvote request will differ somewhat from the PUT requests we've created before. It will involve two queries: first, using the Vote model to create a vote, then querying on that post to get an updated vote count.
 router.put('/upvote', withAuth, (req, res) => {
  // custom static method created in models/Post.js
  if (req.session) {
    Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

//UPDATE /api/posts/:id
router.put('/:id', withAuth, (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


//DELETE /api/posts/:id
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


module.exports = router;




