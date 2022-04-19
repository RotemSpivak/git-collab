import {appController} from "../app.controller.js";
import {storageService} from "./storage-service.js";
export const locService = {
    getLocs,
    saveLocation
}
const STORAGE_KEY = 'locationsDB'


// const locs = [
//     { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
//     { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
// ]
let locs = storageService.loadFromStorage(STORAGE_KEY) || []
function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 100)
    });
}

function saveLocation(location){
    locs.push(location)
    document.querySelector('.location-title').innerHTML = `Location: ${location}`
    document.querySelector('.p-title').innerHTML = `Weather in ${location}:`
    storageService.saveToStorage(STORAGE_KEY,locs)
    return location
}

