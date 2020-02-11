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
    checkFriendExistance: async (user_id,friend_id) => {
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
    }
};
