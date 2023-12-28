import fs from 'fs'

import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'


export const toyService = {
    query,
    getById,
    remove,
    // save,
    update,
}

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
        const toy = await collection.findOne({ _id: new ObjectId(toyId)})
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

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price,
        }
        const collection = await dbService.getCollection('toys')
        await collection.updateOne(
            { _id: new ObjectId(toy._id)},
            { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}
