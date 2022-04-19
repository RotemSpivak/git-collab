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
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onClickOnMap(){

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
        var currLat = response.data.results[0].geometry.location.lat
        var currLng = response.data.results[0].geometry.location.lng
        var loc = { id:currId, name: currLocation, lat: currLat, lng: currLng }
        mapService.panTo(currLat, currLng)
        locService.saveLocation(currLocation)
        renderLocs(loc)
    })
    .catch(function(error){
        console.log(error)
    })
}
