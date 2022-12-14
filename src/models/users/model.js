const HASH_STRENGTH = 10;
const bcrypt = require('bcrypt');

const userModel = (sequelize, DataTypes) => {
    const model = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    model.beforeCreate(async (user) => {
        let hashPassword = await bcrypt.hash(user.password, HASH_STRENGTH);
        user.password = hashPassword;
    });
    return model;
};

module.exports = userModel;
