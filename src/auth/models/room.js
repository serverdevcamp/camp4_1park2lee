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
        }
    }, {
        timestamps: true,
        paranoid: false,
        tableName: 'room',
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    })
);