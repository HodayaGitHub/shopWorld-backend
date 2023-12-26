import { utilService } from './util.service.js'



const map = utilService.readJsonFile('data/map.json')


export const mapService = {
    queryMap
}


function queryMap() {
    return Promise.resolve(map)
}