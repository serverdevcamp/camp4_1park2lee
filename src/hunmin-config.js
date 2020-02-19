let path = require('path');

module.exports = {
    NODE_ENV : "development",
    IP : (this.NODE_ENV === "development") ? "localhost": "localhost",
    AUTH_PORT : (this.NODE_ENV === "development") ? 3300 : 3300,
    CHAT_PORT : (this.NODE_ENV === "development") ? 3000 : 3000,
    SPELL_PORT : (this.NODE_ENV === "development") ? 3100 : 3100,
    AUTH_URL : (this.NODE_ENV === "development") ? "localhost:3300" : "localhost:3300",
    CHAT_URL : (this.NODE_ENV === "development") ? "localhost:3000" : "localhost:3000",
    SPELL_URL : (this.NODE_ENV === "development") ? "localhost:3100" : "localhost:3100",
    CONFIG_PATH : path.join(__dirname , '../config/'),
    IMAGES_PATH : path.join(__dirname, '../data/images')
};
