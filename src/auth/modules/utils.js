const {user, friend} = require('../models');

module.exports = {
    checkEmailExistance: async (email) => {
        return await user.count({
            where: {
                email: email
            }
        })
            .then(count => {
                console.log("count::" + count);
                return count !== 0;

            });
    },
    checkFriendExistance: async (user_id, friend_id) => {
        return await friend.count({
            where: {
                user: user_id,
                friend: friend_id
            }
        })
            .then(count => {
                console.log("count::" + count);
                return count !== 0;
            });
    },

    getFileType: async(filename) => {
        let fileLen = filename.length;
        let lastDot = filename.lastIndexOf('.');

        let fileType = filename.substring(lastDot, fileLen).toLowerCase();
        return fileType;
    },

    getRandomStr: () => {
        var arr  = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var result = '';
        for(var i = 0; i < 6; i++) {
            result += arr.charAt(Math.floor(Math.random() * arr.length));
        }
        return result
    }
};
