const bkfd2Password = require("pbkdf2-password");
const LocalStrategy = require('passport-local').Strategy;
const hasher = bkfd2Password();

const db = require('../models');

module.exports = passport => {

    passport.serializeUser(function (user, done) {
        console.log('passport serializeUser call');
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        console.log('passport deserializeUser call');
        done(null, user);
    });

    passport.use(
        new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
                session: true
            },
            (req, email, password, done) => {
                db.user.findOne({
                    where: {
                        email: email
                    }
                }).then((userRow) => {
                    hasher({
                        password: password,
                        salt: userRow.salt
                    }, (err, pass, salt, hash) => {
                        if (err) {
                            return done(err);
                        } else {
                            if (hash === userRow.pwd) {
                                var user = {
                                    'id': userRow.id,
                                    'email': userRow.email,
                                    'name': userRow.name,
                                    'status': userRow.status,
                                    'grade': userRow.grade
                                };
                                console.log("user!!!", user.status);
                                if (user.status === false)
                                    return done(null, false, {
                                        status: 0,
                                        message: '이메일을 재인증 해주세요!'
                                    });
                                else {
                                    return done(null, user);
                                }
                            } else {
                                return done(null, false, {
                                    status: 1,
                                    message: '존재하지 않는 이메일이거나 비밀번호가 틀렸습니다!'
                                });
                            }
                        }
                    })
                });
            }
        )
    )
};
