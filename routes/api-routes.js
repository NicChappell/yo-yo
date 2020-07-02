// import dependencies
const { Op } = require("sequelize");
var db = require('../models');

// routes
module.exports = function (app) {
    // @route:  GET /api/pins?northEastLat=&northEastLng=&southWestLat=&southWestLng=
    // @desc:   Return all Pin records
    app.get('/api/pins', function (req, res) {
        // destructure query string parameters
        northEastLat = req.query.northEastLat;
        northEastLng = req.query.northEastLng;
        southWestLat = req.query.southWestLat;
        southWestLng = req.query.southWestLng;

        db.Pin.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(new Date() - 0.25 * 60 * 60 * 1000), new Date()]
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

    // @route:  GET /api/pins/count?northEastLat=&northEastLng=&southWestLat=&southWestLng=
    // @desc:   Count all Pin records
    app.get('/api/pins/count', function (req, res) {
        // destructure query string parameters
        northEastLat = req.query.northEastLat;
        northEastLng = req.query.northEastLng;
        southWestLat = req.query.southWestLat;
        southWestLng = req.query.southWestLng;

        db.Pin.count({
            where: {
                createdAt: {
                    [Op.between]: [new Date(new Date() - 0.25 * 60 * 60 * 1000), new Date()]
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

    // @route:  POST /api/pin
    // @desc:   Create a new Pin record
    app.post('/api/pin', function (req, res) {
        db.Pin.findOrCreate({
            where: {
                createdAt: {
                    [Op.between]: [new Date(new Date() - 0.25 * 60 * 60 * 1000), new Date()]
                },
                lat: req.body.lat,
                lng: req.body.lng
            }
        }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            console.log(err);
        });
    });
}