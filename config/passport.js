const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' },
        function(email, password, done) {
          User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Email not registered.' });
            }

            bcrypt.compare(password, user.password, function(err, result) {
                if(result){
                    return done(null, user);
                }
                else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });

          });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}