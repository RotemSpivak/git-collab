import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage-service.js';
export const appController = {
    getLocationName,
    getLocation
}
const STORAGE_KEY = 'locationsDB'
window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.getLocationName = getLocationName
window.onClickOnMap = onClickOnMap
window.onShowLocation = onShowLocation
window.onDeleteLocation = onDeleteLocation
window.onEnterLocation = onEnterLocation

window.onMyLocation = onMyLocation
window.onCopyLocation = onCopyLocation

function onInit() {
    var url = new URL(`${window.location.href}`)
    let newUrl = url.search.split(':')
    console.log(newUrl)
    if(newUrl.length>1){
        console.log(Number(newUrl[1].substring(0,10)))
        console.log(Number(newUrl[2]))
        mapService.initMap(Number(newUrl[1].substring(0,10)),Number(newUrl[2]))
        .then(mapService.clickOnMap)
        .then(mapService.renderMarkers)
    } else mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .then(mapService.clickOnMap)
        // .then(mapService.renderMarkers)
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onClickOnMap() {

}

function onAddMarker() {
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
    .then(locs => {
            // document.querySelector('.locs').innerText = JSON.stringify(locs)
            renderLocs(locs)
        })
}

function renderLocs(locs) {
    let strHTML = ''
    locs.map(loc => {
        strHTML += `<div class="location-card">${loc.name}<div class="buttons"><button onclick="onShowLocation(${loc.lat},${loc.lng})">Go</button>
        <button id="${loc.id}" onclick="onDeleteLocation('${loc.id}')">Delete</button></div></div>`
    })
    document.querySelector('.locs').innerHTML = strHTML

}


function onCopyLocation(ev) {
    ev.preventDefault()
    locService.getLocs()
    .then(positions => {
        console.log(positions[positions.length-1])
        console.log(window.location.href)
            if(!positions[positions.length-1]) window.href.location = 'http://127.0.0.1:5501/index.html'
            let url = '?' + 'lat:' + positions[positions.length-1].lat + '&' + 'lng:' + positions[positions.length-1].lng
            window.location.href = url
            navigator.clipboard.writeText(window.location.href)
    })
   
}

function onShowLocation(lat, lng) {
    mapService.panTo(lat, lng)
}

function onDeleteLocation(currLocation) {

    locService.getLocs()
        .then(locations => {
            let currLocationIdx = locations.findIndex(location => location.id === currLocation)
            locations.splice(currLocationIdx, 1)
            storageService.saveToStorage(STORAGE_KEY, locations)
            mapService.renderMarkers()
            renderLocs(locations)
            mapService.initMap()
                .then(mapService.clickOnMap)
        })
}

function onMyLocation() {
    getPosition()
        .then(pos => {
            let currPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            console.log(pos.coords)
            console.log(currPos)
            mapService.panTo(currPos)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    mapService.panTo(35.6895, 139.6917);
}

function getLocationName(ev, locationName) {
    ev.preventDefault()
    let location = document.querySelector('.location-name')
    locationName = location.value
    location.value = ""
    return locationName
}
function getLocation() {
    let location = document.querySelector('.location-name').value
    document.querySelector('.location-name').value = ''
    return location

}

// function  {
//     let location = document.querySelector('.search-location input').value
//     `https://maps.googleapis.com/maps/api/geocode/json?address=${location}key=${API_KEY}`
// }


function onEnterLocation(){
    const API_KEY = 'AIzaSyAGaZRWdu665a_3TBFr6SdWetGNU0Ef1Wc' //rotems api
    let currLocation = document.querySelector('.search-location input').value  
    let currId = mapService.getRandomId()
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${currLocation}_PIzPuM&key=${API_KEY}`)
    .then(function(response){
        console.log(response)
        let currLat = response.data.results[0].geometry.location.lat
        let currLng = response.data.results[0].geometry.location.lng
        let loc = { id:currId, name: currLocation, lat: currLat, lng: currLng }
        mapService.panTo(currLat, currLng)
        console.log(loc)
        locService.saveLocation(loc)
        locService.getLocs()
        .then(renderLocs)
        // renderLocs()
    })
    .catch(function(error){
        console.log(error)
    })
}
