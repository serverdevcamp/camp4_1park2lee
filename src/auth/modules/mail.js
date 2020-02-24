const config = require('../../hunmin-config');
const path = require('path');

let mailConfig = require(path.join(config.CONFIG_PATH, "mail.json"))[config.NODE_ENV];
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(mailConfig.key);

let jwt = require("jsonwebtoken");
let jwtConfig = require(path.join( config.CONFIG_PATH, "jwt.json"))[config.NODE_ENV].jwt;

let utils = require('./utils');
let redis = require('./redis');


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
            confirm : `http://${config.DOMAIN_NAME}/account/confirm/${token}`,
            reset : `http://${config.DOMAIN_NAME}/reset/password/${token}`
        };

        let contents = {
            confirm : `해당 링크를 누르면 자네는 훈민정음의 진정한 회원이 될수있지... <a href="${url[type]}">${url[type]}</a>`,
            reset : `해당 링크를 누르면 자네의 비밀번호를 다시 설정할 수 있을 걸세 <a href="${url[type]}">${url[type]}</a>`,
        };

        console.log("emailto:"+receiver+typeof(receiver));


        const msg = {
            from: "hunmintalk@gmail.com",
            to: receiver,
            subject: subjects[type],
            text: "훈민정음에 가입하신걸 환영합니다.",
            html: contents[type]
        };

        sgMail.send(msg, function(err,res){
            if(err){
                console.log("smpterror!"+err);
            }else{
                redis.set(receiver, token);
            }
        })
    }
};

