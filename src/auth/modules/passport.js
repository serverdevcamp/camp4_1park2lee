let userTable = require('../models/user');
let passport = require('passport');

var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();


module.exports = {
    initPassport: async (user, done) => {
        passport.serializeUser(function (user, done) {
            console.log('passport serializeUser call')
            done(null, user);
        });
        passport.deserializeUser(function (user, done) {
            console.log('passport deserializeUser call')
            done(null, user);
        });
    },

    usePassport: async () => {
        passport.use(
            new localStrategy({
                    usernameField: 'email',
                    passwordField: 'password',
                    passReqToCallback: true
                },
                async function (req, email, password, done) {
                    let userRow = await userTable.findOne({
                        where: {
                            email: email
                        }
                    });
                    if (email) {
                        hasher({
                            password: userRow.password,
                            salt: userRow.salt
                        }, (err, pass, salt, hash) => {
                            if (err) {
                                return done(err);
                            } else {
                                if (hash === userRow.password) {
                                    const user = {
                                        'email': userRow.email,
                                        'name': userRow.name,
                                        'status': userRow.status,
                                        'grade': userRow.grade
                                    }
                                    if (user.grade == 1 && user.status == 0)
                                        return done(null, false, req.flash('err', 'unauth'));
                                    else
                                        return done(null, user);
                                } else {
                                    return done(null, false, req.flash('err', 'password'));
                                }
                            }
                        });
                    } else {
                        return done(null, false, req.flash('err', 'email'));
                    }
                })
        )
    }
}