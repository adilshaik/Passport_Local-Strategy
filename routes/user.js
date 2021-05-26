const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    const errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill all the details.'
        })
    }

    if (password != password2) {
        errors.push({
            msg: 'Passwords did not match.'
        })
    }

    if (password.length < 6) {
        errors.push({
            msg: 'Password length cannot be less than 6.'
        })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        User.findOne({
            email: email
        }, function (err, user) {
            if (err) return handleError(err);
            if (user) {
                errors.push({
                    msg: 'Email already registered.'
                })
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        // Store hash in your password DB.
                        newUser.password = hash;

                        newUser.save();

                        req.flash('success_msg', 'You have registered successfully.')
                        res.redirect('/users/login');
                    });
                });
            }
        });
    }
})

router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You have been logged out.')
    res.redirect('/users/login');
})

module.exports = router;