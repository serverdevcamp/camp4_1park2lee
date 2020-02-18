const config = require('../../hunmin-config');
const path = require('path');

const bkfd2Password = require("pbkdf2-password");
const LocalStrategy = require('passport-local').Strategy;
const kakaoStrategy = require('passport-kakao').Strategy;
const kakaoClientId = require(path.join( config.CONFIG_PATH, "kakao.json"))[config.NODE_ENV].key;
const hasher = bkfd2Password();



const utils = require('./utils');
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
                    console.log(userRow);
                    if(userRow) {
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
                    }
                    else{
                        return done(null, false, {
                            status: 1,
                            message: '존재하지 않는 이메일이거나 비밀번호가 틀렸습니다!'
                        });
                    }
                });

            }
        )
    );


    async function signinByThirdparty(info, done) {

        console.log('process : ' + info.auth_type);

        // let isExist = await utils.checkEmailExistance(info.auth_id);
        // // console.log("isExist:",isExist);
        // if (isExist) {
        //     console.log("old user");
            db.user.findOne({
                where: {
                    email: info.auth_id
                }
            }).then((userRow) => {
                if(userRow) {
                    let user = {
                        'id': userRow.id,
                        'email': userRow.email,
                        'name': userRow.name,
                        'nickname': userRow.nickname,
                        'status': userRow.status,
                        'grade': userRow.grade,
                        'image_path': userRow.image_path
                    };
                    done(null, user);
                }else{
                    console.log("exist!!");
                    db.user.create({
                        email: info.auth_id,
                        name: info.auth_name,
                        status: true,
                        grade: 3,
                        nickname: info.auth_name,
                        pwd: 'kakao',
                        salt: 'kakao',
                        image_path: "http://localhost:3000/images/default_img.jpg"
                    }).then((result)=>{
                        console.log("result",result);
                        let user = {
                            id: result.id,
                            email: info.auth_id,
                            name: info.auth_name,
                            status: true,
                            grade: 3,
                            nickname: info.auth_name,
                            image_path: "http://localhost:3000/images/default_img.jpg"
                        };
                        done(null, user);
                    }).catch((err)=>{
                        return done(null, false, err);
                    });
                }
            }).catch((err) => {
                return done(null, false, err)
            });

    }

    passport.use('kakao-login', new kakaoStrategy({
            clientID: kakaoClientId,
            callbackURL: 'http://localhost:3300/auth/account/login/oauth',
            // callbackURL: 'http://localhost:8080/login/oath'
        },
        function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;
            console.log('KaKao login info');
            console.log(_profile);

            signinByThirdparty({
                'auth_type': 'kakao',
                'auth_id': _profile.id + '@kakao',
                'auth_name':_profile.properties.nickname,
            }, done);
        }
    ));


};
