
//middleware function that can authguard routes. To authguard a route means to restrict it to authenticated users only.
//This function will act as a normal request callback function, checking for the existence of a session property and using res.redirect() if it's not there. If res.session.user_id does exist, it will call next(), which could potentially be another middleware function or the final function that will render the template.

//With this middleware in place, you can easily protect (i.e., authguard) other routes. You wouldn't want non-authenticated users making POST, PUT, and DELETE requests to your server, so it would be a good idea to authguard those routes as well. To do that, go through your /api controller files and add the withAuth() middleware to all non-GET API routes
const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  module.exports = withAuth;