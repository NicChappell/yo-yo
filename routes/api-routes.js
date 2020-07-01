// import dependencies
const { Op } = require("sequelize");
var db = require('../models');

// routes
module.exports = function (app) {
    // get all pins
    app.get('/api/pins', function (req, res) {
        // destructure query string parameters
        northEastLat = req.query.northEastLat;
        northEastLng = req.query.northEastLng;
        southWestLat = req.query.southWestLat;
        southWestLng = req.query.southWestLng;

        db.Pin.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()]
                },
                lat: {
                    [Op.between]: [parseFloat(southWestLat), parseFloat(northEastLat)]
                },
                lng: {
                    [Op.between]: [parseFloat(southWestLng), parseFloat(northEastLng)]
                }
            }
        }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            console.log(err);
        });
    });

    // create a pin
    app.post('/api/pin', function (req, res) {
        db.Pin.create(req.body).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            console.log(err);
        });
    });
}