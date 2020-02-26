const utils = require('./utils');

let image_types = [
    "image/jpg", "image/jpeg", "image/png"
];

module.exports = (multer) => {

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (image_types.includes(file.mimetype)) {
                console.log("It is image file!");
                cb(null, '../public/images');
            }
        },
        filename:  async function (req, file, cb) {
            let fileType = await utils.getFileType(file.originalname);
            cb(null, "profile_"+req.user.id+fileType);
        }
    });

    return multer({storage: storage});

};




