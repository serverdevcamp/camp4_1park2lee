const passport = require('passport');

const bkfd2Password = require("pbkdf2-password");
const localStrategy = require('passport-local').Strategy;
const hasher = bkfd2Password();

const {
    user
} = require('../models');





module.exports = {
    initPassport: () => {
        passport.serializeUser(function (user, done) {
            console.log('passport serializeUser call')
            done(null, user);
        });
        passport.deserializeUser(function (user, done) {
            console.log('passport deserializeUser call')
            done(null, user);
        });
    },
    authenticate: (strategy, req, res, next) => {

        passport.authenticate(strategy, (err, user, info) => {
            console.log("user:"+user);

            if (err) {
                console.log("err", err);
                return next(err);
            }

            if (!user) {
                console.log("cannot log in" + info);
                return res.status(400).send([user, "Cannot log in", info])
            }

            req.login(user, err => {
                console.log("logged in");
                res.send("Logged in");
            })

        })(req, res, next);
    },
    usePassport: (email, password, done) => {

        passport.use(
            new localStrategy({
                    usernameField: 'email',
                    passwordField: 'password',
                    passReqToCallback: true
                },
                (req, email, password, done) => {
                    console.log("use!")
                    user.findOne({
                        where: {
                            email: email
                        }
                    }).then( (userRow) => {
                        if (userRow) {
                            hasher({
                                password: password,
                                salt: userRow.salt
                            }, (err, pass, salt, hash) => {
                                if (err) {
                                    return done(err);
                                } else {
                                    if (hash === userRow.pwd) {
                                        const user = {
                                            'email': userRow.email,
                                            'name': userRow.name,
                                            'status': userRow.status,
                                            'grade': userRow.grade
                                        }
                                        if (user.grade == 1 && user.status == 0)
                                            return done(null, false, {
                                                message: 'Please check confirm your mail'
                                            })
                                        else
                                            return done(null, user);
                                    } else {
                                        return done(null, false, {
                                            message: 'Incorrect password'
                                        });
                                    }
                                }
                            });
                        } else {
                            return done(null, false, {
                                message: 'The email is not exist'
                            });
                        }
                    })
                })
        )

    }
}