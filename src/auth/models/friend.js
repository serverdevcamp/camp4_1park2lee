module.exports = (sequelize, DataTypes) => (
    sequelize.define('friend', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        friend: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, 
        },
        room: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: false,
        tableName: 'friend',
        createdAt: 'created_date',
        updatedAt: 'updated_date',
    })
);