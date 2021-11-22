/*  Package Imports*/
/*Step 2.1 Setting Up Expression Session*/
const session = require("express-session");

/*Step 3.1: Passport Configuration*/
const passport = require("passport");
const GitHubStrategy= require("passport-github2").Strategy;

/*CC included*/
const path = require("path");
require("dotenv").config();
const express = require('express');
const partials = require('express-partials');


const app = express();


/*CC Included these:  Variable Declarations*/

const PORT = 3000;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/* Passport Configurations*/
/*Step 3.2 and Step 3.3 */
passport.use( new GitHubStrategy(
  {
    clientID=GITHUB_CLIENT_ID,
    clientSecret=GITHUB_CLIENT_SECRET,
    callbackURL= "http://localhost:3000/auth/github/callback",
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
   }
  )
);

/*Step 4.1*: Passport Session Serializers/
passport.serializeUser((user, done) => {
  done(null, user);
});

/*Step 4.2*/
passport.deserializeUser((user, done) => {
  done(null, user);
});


/*Express Project Setup*/

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
/*step 2.2*/
app.use(session({ secret:"codecademy", resave: false, saveUninitialized: false}));

/*Step 3.4*/
app.use(passport.initialize());

/*Step 3.5*/
app.use(passport.session());

/* Routes*/

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
})

/*Step 5.3*/
app.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { user: req.user });
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/*Step 5.1: Implementing OAuth Routes*/
app.get("/auth/github",passport.authenticate("github", {scope: ["user"]}));

/*Step 5.2*/
app.get( "/auth/github/callback", 
         passport.authenticate("github", {
           failureRedirect : "/login",
           successRedirect: "/",
        })
);





/* Listener*/

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/* ensureAuthenticated Callback Function*/
/*Step 5.4*/
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next;
  }else{
    res.redirect("/login");
  }
}

