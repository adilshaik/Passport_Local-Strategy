const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');

//Initializing app with express
const app = express();
require('./config/passport')(passport);

//For getting for data
app.use(express.urlencoded({ extended: true }));

//Setting up database
const db = require('./config/key').mongoURI;
const { initialize } = require('passport');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
 .then(console.log(`MongoDB connected...`))
 .catch(err => console.log(err));

//Express Session for storing data in the server
 app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

// Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());

// Initializing flash
app.use(flash());

//EJS Template
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Global variables
app.use(( req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})