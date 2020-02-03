module.exports = (sequelize, DataTypes) => (
    sequelize.define('room', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        room_name: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        created_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        }
    }, {
        timestamps: false,
        paranoid: false,
        tableName: 'room'
    })
);