import fs from 'fs'

import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'


export const toyService = {
    query,
    getById,
    remove,
    add,
    update,
}

async function query(filterBy, sortBy) {
    try {
        const criteria = {}

        if (filterBy?.txt) {
            criteria.name = { $regex: filterBy.txt, $options: 'i' }
        }

        if (filterBy?.maxPrice > 0) {
            criteria.price = { $lte: filterBy.maxPrice }
        }

        // filterBy.labels = ["Space Ranger", "Doll"]
        if (filterBy?.labels?.length > 0) {
            criteria.labels = { $in: filterBy.labels }
        }

        const collection = await dbService.getCollection('toy')

        const sortCriteria = {}
        if (sortBy?.by) {
            const sortAsc = JSON.parse(sortBy.asc)
            sortCriteria[sortBy.by] = sortAsc ? 1 : -1
        }

        console.log(sortCriteria)
        let toys = await collection.find(criteria).sort(sortCriteria).toArray()
        return toys

    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}


async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
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
        logger.error(`cannot remove car ${toyId}`, err)
        throw err
    }
}

async function update(toy) {
    try {
        console.log('toy to remove', toy)
        const toyToSave = {
            name: toy.name,
            price: toy.price,
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne(
            { _id: new ObjectId(toy._id) },
            { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert car', err)
        throw err
    }
}
