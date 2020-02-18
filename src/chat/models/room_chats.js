module.exports = (sequelize, DataTypes) => (
    sequelize.define('room_chats', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        chat_id: {
            type: DataTypes.STRING(24),
            allowNull: false,
        }
    }, {
        timestamps: false,
        paranoid: false,
        tableName: 'room_chats',
        userId: 'user_id',
        roomId: 'room_id'
    })
);