let path = require('path');
let NODE_ENV = "development";

module.exports = {
    NODE_ENV: NODE_ENV,
    DOMAIN_NAME:  (NODE_ENV === "development") ? "localhost:8080" : "hunmintalk.tk",
    IP: (NODE_ENV === "development") ? "localhost" : "34.219.138.15",
    AUTH_PORT: (NODE_ENV === "development") ? 3300 : 3300,
    CHAT_PORT: (NODE_ENV === "development") ? 3000 : 3000,
    SPELL_PORT: (NODE_ENV === "development") ? 3200 : 3200,
    AUTH_URL: (NODE_ENV === "development") ? "localhost:3300" : "34.219.138.15:3300",
    CHAT_URL: (NODE_ENV === "development") ? "localhost:3000" : "34.219.138.15:3000",
    SPELL_URL: (NODE_ENV === "development") ? "localhost:3200" : "34.219.138.15:3200",
    CONFIG_PATH: path.join(__dirname, '../config/'),
    IMAGES_PATH: path.join(__dirname, '../data/images')
};
