// email search helper function
const getUserByEmail = (email, database) => {
  for (let keyID in database) {
    if (database[keyID].email === email) return database[keyID];
  }
  return false;
};

module.exports = { getUserByEmail };