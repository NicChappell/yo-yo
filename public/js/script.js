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
    // remove disabled attribute from button node
    button.removeAttribute('disabled')

    // destructure event and update state
    bounds = e.bounds
    latlng = e.latlng

    // get pins
    getPins()

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
    // recalculate map bounds and update state
    bounds = map.getBounds()

    // clear existing pins
    getPinsLayer.clearLayers()

    // get pins
    getPins()
}

// dom event handlers
const handleClick = () => postPin()

// attach leaflet event handlers
map.on('locationerror', handleLocationError)
map.on('locationfound', handleLocationFound)
map.on('zoom', handleZoom)

const countPins = () => {
    // get pins count from server and update state
    axios.get('/api/pins/count' + queryString())
        .then(res => count.textContent = res.data)
        .catch(err => console.log(err))
}

const getPins = () => {
    // get pins data from server
    axios.get('/api/pins' + queryString())
        .then(res => {
            // destructure response
            const {
                count: pinCount,
                rows: pins
            } = res.data

            // set count node text content
            pinCount
                ? count.textContent = pinCount
                : count.textContent = ''

            // define and add markers to map
            pins.forEach(pin => {
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
            const {
                lat,
                lng
            } = res.data

            // update pin count
            countPins()

            // open marker popup
            marker.openPopup()

            // update icon inner html
            icon.innerHTML = 'check'

            // update button node
            button.setAttribute('disabled', true)
            button.classList.add('fade-out')

            // wait 3.5 seconds
            setTimeout(() => {
                // remove button node from dom
                button.remove()

                // clear post pin layer
                postPinLayer.clearLayers()

                // define and add marker to get pins layer
                marker = L.marker({ lat, lng }, { icon: yoyoPink })
                    .addTo(getPinsLayer)
                    .bindPopup('<span class="yo">Yo!<span>', {
                        closeButton: false,
                        maxWidth: 'auto'
                    })
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
        '?northEastLat=' + northEastLat.toFixed(5)
        + '&northEastLng=' + northEastLng.toFixed(5)
        + '&southWestLat=' + southWestLat.toFixed(5)
        + '&southWestLng=' + southWestLng.toFixed(5)
    )
}

const init = () => {
    // select nodes and update state
    button = document.querySelector('#button')
    count = document.querySelector('#count')
    icon = document.querySelector('i')

    // add disabled attribute to button node
    button.setAttribute('disabled', true)

    // add click event listener to button node
    button.addEventListener('click', handleClick)

    // detect user location
    map.locate({ setView: true, maxZoom: 15 })
}

init()

