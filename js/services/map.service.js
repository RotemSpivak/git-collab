import { appController } from "../app.controller.js";
import { locService } from "./loc.service.js";

export const mapService = {
    initMap,
    addMarker,
    panTo,
    clickOnMap,
    getGCurrLocation,
    getRandomId,
    renderMarkers
}

var gMap;
var gMarkers

function getGCurrLocation(){
    return gCurrLocation
}

function renderMarkers(){
    locService.getLocs()
    .then(locations => {
        let latLng = locations.map(location =>{
            return {lat:location.lat,
                lng:location.lng}
            })
           latLng.forEach(position => addMarker(position))
        }
        )
        }

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
        })
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
    console.log('PANNING')
}



function clickOnMap(){
   
    gMap.addListener('click',(ev)=>{
        let text = document.querySelector('.location-name')
        console.log(text.value)
        if(!text.value) return
        renderMarkers()
        addMarker(ev.latLng)
        console.log(ev.latLng.lat())
        console.log(ev.latLng.lng())
        let name = appController.getLocation()
        let id = getRandomId()
        const currLocation = {id,name:name,lat:ev.latLng.lat(),lng:ev.latLng.lng()}
        locService.saveLocation(currLocation)
    })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAPqMGz67tttaxNRhLaIjClAWnA_gv56kg'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getRandomId(){
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
}

