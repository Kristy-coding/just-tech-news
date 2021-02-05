async function newFormHandler(event) {
    event.preventDefault();
  
    const title = document.querySelector('input[name="post-title"]').value;
    const post_url = document.querySelector('input[name="post-url"]').value;
  

    ////On form submission, this will grab the post-title and post-url values from the form and send them with a POST request to /api/posts. Remember, though, that the /api/posts endpoint requires a third property: the user ID. Like the other routes, this can be obtained from the session
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        post_url
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
        // if the response from the database is good then we are redirected to the dashboard where we can see our new post was created/ added to the database and displayed on the dashboard 
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
  
  document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);