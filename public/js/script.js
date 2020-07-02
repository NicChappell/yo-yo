// initialize the map
const map = L.map('map').fitWorld()

// define and add tile layer to map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    accessToken: 'pk.eyJ1IjoibmljY2hhcHBlbGwiLCJhIjoiY2tjMmdsZGcxMDA2MDJ6bDg5ZWt5cGozdiJ9.-pMdK6BaZnLaPADQDm0GbQ',
    attribution: 'Map data &copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    minZoom: 9,
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map)

// define and add pin layers to map
const getPinsLayer = L.layerGroup().addTo(map);
const postPinLayer = L.layerGroup().addTo(map);

// define custom map icons
const yoyoPink = L.icon({
    iconUrl: '../img/yoyo-pink.svg',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -24]
})
const yoyoPurple = L.icon({
    iconUrl: '../img/yoyo-purple.svg',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -24]
})

// state variables
let bounds = {}
let button = {}
let count = {}
let icon = {}
let latlng = {}
let marker = {}

// leaflet event handlers
const handleLocationError = (e) => alert(e.message)
const handleLocationFound = (e) => {
    // get pins
    getPins()

    // count pins
    countPins()

    // update button node
    button.classList.remove('hide')

    // destructure event and update state variables
    bounds = e.bounds
    latlng = {
        // lat: e.latlng.lat.toPrecision(6),
        // lng: e.latlng.lng.toPrecision(6)
        lat: e.latlng.lat.toFixed(6),
        lng: e.latlng.lng.toFixed(6)
    }

    // restrict map view to the given bounds
    map.setMaxBounds(bounds)

    // define and add marker to post pin layer
    marker = L.marker(latlng, { icon: yoyoPink })
        .addTo(postPinLayer)
        .bindPopup('<span class="yo">Yo!<span>', {
            closeButton: false,
            maxWidth: 'auto'
        })
}
const handleZoom = () => {
    // recalculate map bounds and update state variables
    bounds = map.getBounds()

    // clear existing pins
    getPinsLayer.clearLayers()

    // get pins
    getPins()

    // count pins
    countPins()
}

// attach leaflet event handlers
map.on('locationerror', handleLocationError)
map.on('locationfound', handleLocationFound)
map.on('zoom', handleZoom)

const countPins = () => {
    // get pins count from server and update state variables
    axios.get('/api/pins/count' + queryString())
        .then(res => {
            // destructure response
            const { data: pinCount } = res

            // update count node
            pinCount
                ? count.textContent = pinCount
                : count.textContent = ''
        })
        .catch(err => console.log(err))
}

const getPins = () => {
    // get pins data from server
    axios.get('/api/pins' + queryString())
        .then(res => {
            // destructure response
            const { data: pins } = res

            // filter pins
            const filteredPins = pins.filter(pin => pin.lat != latlng.lat && pin.lng != latlng.lng)

            // define and add markers to map
            filteredPins.forEach(pin => {
                // destructure pin
                const {
                    lat,
                    lng
                } = pin

                L.marker({ lat, lng }, { icon: yoyoPurple })
                    .addTo(getPinsLayer)
                    .bindPopup('<span class="yo">Yo!<span>', {
                        closeButton: false,
                        maxWidth: 'auto'
                    })
            })
        })
        .catch(err => console.log(err))
}

const postPin = () => {
    // post pin data to server
    axios.post('/api/pin', latlng)
        .then(res => {
            // destructure response
            const created = res.data[1]

            // update count node
            created
                ? count.textContent = parseInt(count.textContent || 0) + 1
                : count.textContent = count.textContent

            // open marker popup
            marker.openPopup()

            // update button node
            button.setAttribute('disabled', true)
            button.classList.add('fade-out')

            // update icon node
            icon.innerHTML = 'check'

            // wait 3.5 seconds
            setTimeout(() => {
                // remove button node from dom
                button.remove()
            }, 3500)
        })
        .catch(err => console.log(err))
}

const queryString = () => {
    // destructure bounds
    const {
        _northEast,
        _southWest
    } = bounds

    // destructure northeast bound
    const {
        lat: northEastLat,
        lng: northEastLng
    } = _northEast

    // destructure southwest bound
    const {
        lat: southWestLat,
        lng: southWestLng
    } = _southWest

    // concatenate and return query string
    return (
        '?northEastLat=' + northEastLat
        + '&northEastLng=' + northEastLng
        + '&southWestLat=' + southWestLat
        + '&southWestLng=' + southWestLng
    )
}

const init = () => {
    // select nodes and update state variables
    button = document.querySelector('#button')
    count = document.querySelector('#count')
    icon = document.querySelector('i')

    // add click event listener to button node
    button.addEventListener('click', () => postPin())

    // detect user location
    map.locate({ setView: true, maxZoom: 15 })
}

init()

