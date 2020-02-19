const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "x98thb": "http://www.tsn.ca"
};
// global object
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "123"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "abc"
  }
}

//random 6 string generator
const generateRandomString = () => Math.random().toString(36).substring(7);

 // email search helper function
 const emailSearch = (email) => {
  for (let keyID in users) {
    if (users[keyID].email === email)
    return users[keyID];
  }
  return false;
};

// validate user helper function
// const validateUser = (email, password) => {
//   // loops over everything in users and returns the first case where the conditions match
//   for (user in users) {
//     console.log(user.email);
//     console.log(user.password);
//     return (user.email === email && user.password === password);
//   }
//   return;
// };

// console.log(validateUser("user@example.com", "123"));
// console.log(validateUser("user2@example.com", "abc"));
// console.log(validateUser("user@example.com", "htl"));
// console.log(validateUser("user37@example.com", "opp"));


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

 //rendering new login template
 app.get("/login", (req, res) => {
  let templateVars = {email: req.body.email, password: req.body.password, user:  users[req.cookies.user_id] };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
 // console.log("user info -->", users);
  let templateVars = { urls: urlDatabase, user:  users[req.cookies.user_id] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {user:  users[req.cookies.user_id]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user:  users[req.cookies.user_id] };
  res.render("urls_show", templateVars);
});

//when user clicks shortURL, browser redirects to actual webpage by accessing the longURL which stored the full address POSTED in form
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// Update express server so that the shortURL-longURL key-value pair are saved to urlDatabase when it receives a POST request to /urls
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});
//deletes url
app.post("/urls/:shortURL/delete", (req, res) => {
 delete urlDatabase[req.params.shortURL]
 res.redirect('/urls');
});

//edits and updates new long url
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
 });


// read body's email and password, find the user that matches those and extract the userID. assign that userID to cookie

// Login function>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 app.post("/login", (req, res) => {
  // check if email exists
  let user = (emailSearch(req.body.email)) 
    if (user === false) {
    res.sendStatus(403);
    } 
    // check if password matches
    if (req.body.password === user.password) {
    res.cookie("user_id", user.id);
    res.redirect('/urls');
  } else {
    console.log("validation error");
    res.sendStatus(403);
  }
});


 //logs out user
 app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
 });

// show registration page
app.get("/register", (req, res) => {
  //console.log("user info -->", users[req.cookies.user_id]);
  let templateVars = {email: req.body.email, password: req.body.password, user:  users[req.cookies.user_id] };
  res.render("register", templateVars);
});

// registration event handler
app.post("/register", (req, res) => {
  // check if text fields are empty
  if (req.body.email === '' || req.body.password === '') {
    res.sendStatus(400);
  }
  // check if email already exists
  if (emailSearch(req.body.email)) {
    res.sendStatus(400);
  } else {
  // generate new user info child object
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie("user_id", userID);
  res.redirect('/urls');
  
  }
 });





