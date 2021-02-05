// we can write our own helper functions to use in handlebars 

//In this file, we'll export a function that makes the first test pass
//Instead of doing this formatting with Moment, we use the methods built into the Date object
module.exports = {
    format_date: date => {
      return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
        date
      ).getFullYear()}`;
    },
    format_plural: (word, amount) => {
        if (amount !== 1) {
          return `${word}s`;
        }
    
        return word;
    },
    //The split() method is used to split a string into an array of substrings, and returns the new array
    // here we are saying that we want to split the urls at every '/' and then return the first index of that new array (which would just bet the .com phrase)
    format_url: url => {
        return url
          .replace('http://', '')
          .replace('https://', '')
          .replace('www.', '')
          .split('/')[0]
          .split('?')[0];
      }
  }