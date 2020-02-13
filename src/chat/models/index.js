var path = require('path');
const Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var mysqlConfig = require(path.join(__dirname, '..', 'config', 'mysql.json'))[env];
var db = {};

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
    latest_chat_id: { //마지막 읽은 대화가 없을 시, null값
        type: Sequelize.INTEGER,
        allowNull: true,
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
});



db.room_members = room_members;

module.exports = db;