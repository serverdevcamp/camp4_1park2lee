module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        pwd: {
            type: DataTypes.STRING(172),
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING(88),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        latest_access_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        photo: {
            type: DataTypes.BLOB,
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, //migration오류로 0로 표시할 것을 false로
        },
        grade: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, //migration오류로 1로 표시할 것을 true로
        },
        error_cnt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
        paranoid: false,
        tableName: 'user',
        createdAt: 'register_date',
        updatedAt: 'update_date'
    })
);