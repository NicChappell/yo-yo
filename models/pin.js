module.exports = function (sequelize, DataTypes) {
    var Pin = sequelize.define("Pin", {
        lat: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isFloat: true
            }
        },
        lng: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isFloat: true
            }
        }
    });
    return Pin;
};
