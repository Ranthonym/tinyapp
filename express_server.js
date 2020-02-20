const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// global object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "abc"
  }
};

//random 6 string generator
const generateRandomString = () => Math.random().toString(36).substring(7);

// email search helper function
const emailSearch = email => {
  for (let keyID in users) {
    if (users[keyID].email === email) return users[keyID];
  }
  return false;
};
//  function that returns the URLs where the userID is equal to the id of the currently logged in user.
const urlsForUser = (id) => {
  let urlArr = [];
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      urlArr.push(shortURL);
    }
  }
  return urlArr;
};

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
  let templateVars = {
    email: req.body.email,
    password: req.body.password,
    user: users[req.cookies.user_id]
  };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  //generate new filtered object holding all short URLS matched to the logged in user_id
  let objURL = {}
  let urlArr = urlsForUser(req.cookies.user_id);

  for (let shortURL in urlDatabase) {
    for (let j = 0; j<  urlArr.length; j++) {
      if(shortURL === urlArr[j]) {
        objURL[shortURL] = urlDatabase[shortURL];
      }
    }
  }
  // pass new filtered object to template file for rendering unique table
  let templateVars = { urls: objURL, user: users[req.cookies.user_id] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  if (req.cookies.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

//when user clicks shortURL, browser redirects to actual webpage by accessing the longURL which stored the full address POSTED in form
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// Update express server with new shortURL object entry
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.cookies.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});

//deletes url
app.post("/urls/:shortURL/delete", (req, res) => {
  // check if url's user ID matches cookie's user ID. then delete if yes
  if (urlDatabase[req.params.shortURL].userID === (req.cookies.user_id)) {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
  } else {
    res.sendStatus(403);
  }
});

//edits and updates new long url
app.post("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === (req.cookies.user_id)) {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect("/urls");
  } else {
     res.sendStatus(403);
  }
});

// read body's email and password, find the user that matches those and extract the userID. assign that userID to cookie

// Login function
app.post("/login", (req, res) => {
  // check if email exists
  let user = emailSearch(req.body.email);
  if (user === false) {
    res.sendStatus(403);
  }
  // check if password matches
  if (req.body.password === user.password) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.sendStatus(403);
  }
});

//logs out user
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// show registration page
app.get("/register", (req, res) => {
  let templateVars = {
    email: req.body.email,
    password: req.body.password,
    user: users[req.cookies.user_id]
  };
  res.render("register", templateVars);
});

// registration event handler
app.post("/register", (req, res) => {
  // check if text fields are empty
  if (req.body.email === "" || req.body.password === "") {
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
    };
    res.cookie("user_id", userID);
    res.redirect("/urls");
  }
});


