const { user } = require('../models');

module.exports = {
    checkEmailExistance: async(email) => {
        return await user.count({
            where: {
                email: email
            }
        })
        .then(count => {
            console.log("count::" + count);
            if (count != 0) {
                return false;
            }
            return true;
        });
    }
}
