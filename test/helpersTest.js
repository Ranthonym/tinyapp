const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', (done) => {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    // const actualOutput = user.email //email: user@example.com
    assert.equal(expectedOutput, user.id);
    done();
  });
  it('should return undefined with non-existent email', (done) => {
    const user = getUserByEmail("nonexist@example.com", testUsers)
    const expectedOutput = undefined;
    // const actualOutput = user.email //email: user@example.com
    assert.equal(expectedOutput, user.id);
    done();
  });
});
