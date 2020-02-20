const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../hunmin-config');

let env = config.NODE_ENV;
let mysqlConfig = require(path.join(config.CONFIG_PATH,'mysql.json'))[env];
let db = {};

const sequelize = new Sequelize(
    mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, mysqlConfig.config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.room = require('./room')(sequelize, Sequelize);
db.user = require('./user')(sequelize, Sequelize);
db.room_chats = require('./room_chats')(sequelize, Sequelize);
db.friend = require('./friend')(sequelize, Sequelize);

const room_members = sequelize.define('room_members', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    latest_chat_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    latest_chat_stime: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    room_name: {
        type: Sequelize.STRING(20),
        allowNull: true
    }
}, {
    timestamps: false,
    paranoid: false
});

/**
 * 다대다 관계 명시 및 테이블 선언부분
 */

db.room.hasMany(db.room_chats, {
    foreignKey: 'room_id',
    sourceKey: 'id',
    onDelete: 'cascade'
});
db.room_chats.belongsTo(db.room, {
    foreignKey: 'room_id',
    targetKey: 'id'
});

db.room.belongsToMany(db.user, {
    through: 'room_members',
    foreignKey: 'room_id',
    timestamps: false,
    paranoid: false,

});
db.user.belongsToMany(db.room, {
    through: 'room_members',
    foreignKey: 'user_id',
    timestamps: false,
    paranoid: false
})


db.room_members = room_members;




module.exports = db;