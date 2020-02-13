let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
let mailConfig = require('../config/mail');

let jwt = require("jsonwebtoken");
let jwtConfig = require('../config/jwt').jwt;

let utils = require('./utils');
let redis = require('./redis');


const transporter = nodemailer.createTransport(
    smtpTransport({
        service:'gmail',
        host: 'smtp.gmail.com',
        auth: mailConfig
    })
);

module.exports = {
    sendEmail: (receiver, type)=>{

        let token = jwt.sign(
            {
                user : receiver,
                rand : utils.getRandomStr(),
            },
            jwtConfig,
            {
                expiresIn: '10m',
            }
        );


        let subjects = {
            confirm : '훈민정음 이메일인증 해주시지요.',
            reset : '고마몬 비밀번호 초기화',
        };

        let url = {
            confirm : `http://localhost:3300/auth/account/confirm/${token}`,
            reset : `http://localhost:3300/auth/reset/password/${token}`
        };

        let contents = {
            confirm : `해당 링크를 누르면 자네는 훈민정음의 진정한 회원이 될수있지... <a href="${url[type]}">${url[type]}</a>`,
            reset : `해당 링크를 누르면 자네의 비밀번호를 다시 설정할 수 있을 걸세 <a href="${url[type]}">${url[type]}</a>`,
        };

        console.log("emailto:"+receiver+typeof(receiver));

        transporter.sendMail({
            from: mailConfig.email,
            to: receiver,
            subject: subjects[type],
            html: contents[type],
        }, function(err,res){
            if(err){
                console.log("smpterror!"+err);
            }else{
                redis.set(receiver, token);
                console.log(res);
            }
        })
    }
};

