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
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//random 6 string generator
const generateRandomString = () => Math.random().toString(36).substring(7);

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

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies.username};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username };
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

  //edits new username to cookie
 app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
 });

 //logs out user
 app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect('/urls');
 });

// show registration page
app.get("/register", (req, res) => {
  let templateVars = {email: req.body.email, password: req.body.password, username: req.cookies.username };
  res.render("register", templateVars);
});

// registration event handler
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.statusCode = 400;
  }
  if (emailSearch(req.body.email)) {
    res.statusCode =  400;
  }
  const userID = generateRandomString();
  users["id"] = userID;
  users["email"] = req.body.email;
  users["password"] = req.body.password;
  res.cookie("user_id", userID);
  res.redirect('/urls');
 });

 // email search helper function
 const emailSearch = (email) => {
   for (let keyID in users) {
     if (users[keyID].email === email)
     return true;
   }
   return;
 };


