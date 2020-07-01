// initialize the map
var map = L.map('map').fitWorld();

// define and add tile layer to map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    accessToken: 'pk.eyJ1IjoibmljY2hhcHBlbGwiLCJhIjoiY2tjMmdsZGcxMDA2MDJ6bDg5ZWt5cGozdiJ9.-pMdK6BaZnLaPADQDm0GbQ',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    minZoom: 9,
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

// define custom map icons
const yoyoPink = L.icon({
    iconUrl: '../img/yoyo-pink.svg',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -24]
});
const yoyoPurple = L.icon({
    iconUrl: '../img/yoyo-purple.svg',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -24]
});

// add event listeners
map.on('locationerror', handleLocationError);
map.on('locationfound', handleLocationFound);
map.on('zoom', handleZoom);

// detect user location
map.locate({ setView: true, maxZoom: 16 });

// state variables
var bounds = {};
var button = {};
var latlng = {};

function handleClick() {
    // post pin
    postPin();
}

function handleLocationError(e) {
    alert(e.message);
}

function handleLocationFound(e) {
    // destructure event
    bounds = e.bounds;
    latlng = e.latlng;

    // get pins
    getPins();

    // restrict map view to the given bounds
    map.setMaxBounds(bounds);

    // define and add marker to map
    L.marker(latlng, { icon: yoyoPink })
        .addTo(map)
        .bindPopup("Yo!", {
            closeButton: false,
            maxWidth: "auto"
        })
        .openPopup();
}

function handleZoom() {
    bounds = map.getBounds();
}

function init() {
    // select button
    button = document.querySelector("#button");

    // add click event listener
    button.addEventListener("click", handleClick);
}

function getPins() {
    // destructure bounds
    var northEastLat = bounds._northEast.lat;
    var northEastLng = bounds._northEast.lng;
    var southWestLat = bounds._southWest.lat;
    var southWestLng = bounds._southWest.lng;

    // construct query string
    var queryString = '?northEastLat=' + northEastLat.toFixed(5);
    queryString += '&northEastLng=' + northEastLng.toFixed(5);
    queryString += '&southWestLat=' + southWestLat.toFixed(5);
    queryString += '&southWestLng=' + southWestLng.toFixed(5);

    // send get request
    axios.get('/api/pins' + queryString)
        .then(function (res) {
            // destructure response
            var pins = res.data;

            // define and add markers to map
            pins.forEach(function (pin) {
                L.marker({ lat: latlng.lat, lng: latlng.lng }, { icon: yoyoPurple })
                    .addTo(map)
                    .bindPopup("Yo!", {
                        closeButton: false,
                        maxWidth: "auto"
                    });
            })
        })
        .catch(function (err) {
            console.log(err);
        });
}

function postPin() {
    // send post request
    axios.post('/api/pin', latlng)
        .then(function (res) {
            console.log(res);

            // remove button from dom
            button.remove();
        })
        .catch(function (err) {
            console.log(err);
        });
}

init();

