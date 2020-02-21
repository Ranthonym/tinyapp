// email search helper function
const getUserByEmail = (email, database) => {
  for (let keyID in database) {
    if (database[keyID].email === email) return database[keyID];
  }
  return false;
};

//random 6 string generator
const generateRandomString = () => Math.random().toString(36).substring(7);


//  function that returns the URLs where the userID is equal to the id of the currently logged in user.
const urlsForUser = (id, database) => {
  let urlArr = [];
  for (let shortURL in database) {
    if (database[shortURL].userID === id) {
      urlArr.push(shortURL);
    }
  }
  return urlArr;
};


module.exports = { getUserByEmail, urlsForUser, generateRandomString };