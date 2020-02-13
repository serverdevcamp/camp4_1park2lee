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
    }
};
