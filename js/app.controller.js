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

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .then(mapService.clickOnMap)
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onClickOnMap(){

}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs)
            renderLocs(locs)
        })
}

function renderLocs(locs){
    let strHTML = ''
    locs.map(loc => {
        strHTML += `<div class="location-card}">${loc.name}<button onclick="onShowLocation(${loc.lat},${loc.lng})">Go</button>
        <button id="${loc.id}" onclick="onDeleteLocation('${loc.id}')">Delete</button></div>`
    })
    document.querySelector('.locs').innerHTML = strHTML

}

function onShowLocation(lat,lng){
    mapService.panTo(lat,lng)
}

function onDeleteLocation(currLocation){
    locService.getLocs()
    .then(locations => {
       let currLocationIdx = locations.findIndex(location => location.id === currLocation)
        locations.splice(currLocationIdx,1)
        storageService.saveToStorage(STORAGE_KEY,locations)
        
        renderLocs(locations)
    })
}

function centerOnUser(){
    mapService.panTo()
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function getLocationName(ev,locationName){
    ev.preventDefault()
    let location = document.querySelector('.location-name')
    locationName = location.value
    location.value = ""
    return locationName
}
function getLocation(){
    let location = document.querySelector('.location-name').value
    document.querySelector('.location-name').value = ''
    return location

}

