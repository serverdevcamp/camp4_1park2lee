
let image_types = [
    "image/jpg", "image/jpeg", "image/png"
];

module.exports = multer => {

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (image_types.includes(file.mimetype)) {
                console.log("It is image file!");
                cb(null, 'uploads/images')
            }
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    });

    return multer({storage: storage});

};




