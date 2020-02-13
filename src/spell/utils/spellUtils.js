const pattern = /^[a-zA-Zㄱ-힣0-9\s]*$/;


module.exports = {
    filter: (msg) => {
        return msg.replace(/(^[\sa-zA-Z!?:;'"#$%^&*~`.,<>\^]*)|([\sa-zA-Z!?;'"#$%^&*~`.,<>\^]*$)/gi, "");
    },
    saveFilter: (msg) => {
        return pattern.test(msg);
    }
};