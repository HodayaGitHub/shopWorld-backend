import fs from 'fs'

import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'

import { utilService } from '../../services/util.service.js'
import { logger } from '../../services/logger.service.js'


export const toyService = {
    query,
    getById,
    remove,
    save,
}

// const items = utilService.readJsonFile('data/toy.json')


async function query(filterBy) {
    try {
        const criteria = {}

        if (filterBy.txt) {
            criteria.name = { $regex: filterBy.txt, $options: 'i' }
        }

        if (filterBy.maxPrice > 0) {
            criteria.price = { $lte: filterBy.maxPrice }
        }

        // filterBy.labels = ["Space Ranger", "Doll"]
        if (filterBy.labels.length > 0) {
            criteria.labels = { $in: filterBy.labels }
        }

        const collection = await dbService.getCollection('toys')
        let toys = await collection.find(criteria).toArray()
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}


async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toys')
        const toy = await collection.findOne({ _id: new ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}


async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: new ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}










// function remove(id) {
//     const idx = items.findIndex(item => item._id === id)
//     if (idx === -1) return Promise.reject('No Such item')
//     const item = items[idx]

//     // if (!loggedinUser.isAdmin &&
//     //     item.owner._id !== loggedinUser._id) {
//     //     return Promise.reject('Not your item')
//     // }
//     items.splice(idx, 1)
//     return _saveItemsToFile()
// }

function save(item, loggedinUser) {
    if (item._id) {
        const itemToUpdate = items.find(currItem => currItem._id === item._id)
        // if (!loggedinUser.isAdmin &&
        //     itemToUpdate.owner._id !== loggedinUser._id) {
        // return Promise.reject('Not your item')
        // }

        itemToUpdate.name = item.name
        itemToUpdate.price = item.price
        itemToUpdate.labels = item.labels
        itemToUpdate.inStock = item.inStock
        item = itemToUpdate
    } else {
        item._id = utilService.makeId()
        item.owner = {
            fullname: loggedinUser.fullname,
            score: loggedinUser.score,
            _id: loggedinUser._id,
            isAdmin: loggedinUser.isAdmin
        }
        items.push(item)
    }

    return _saveItemsToFile().then(() => item)
}


function _saveItemsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(items, null, 4)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                logger.error('Cannot write to items file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
