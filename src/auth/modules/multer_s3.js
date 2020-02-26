const utils = require('./utils');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');

const config = require('../../hunmin-config.js');

aws.config.loadFromPath(path.join(config.CONFIG_PATH, "aws.json"));
aws.config.region = 'us-west-2';
let s3 = new aws.S3();

let image_types = [
    "image/jpg", "image/jpeg", "image/png"
];

module.exports = (multer) => {

    return multer({
        storage: multerS3({
            s3: s3,
            bucket: "hunmin",
            key: async function (req, file, cb) {
                if (image_types.includes(file.mimetype)) {
                    console.log("It is image file!");
                    let fileType = await utils.getFileType(file.originalname);
                    console.log(fileType);
                    cb(null, "profile_" + req.user.id + fileType);
                }
            },
            acl: 'public-read-write',
        })
    })
};




