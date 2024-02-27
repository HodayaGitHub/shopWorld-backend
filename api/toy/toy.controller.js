import { toyService } from "./toy.service.js"
import { logger } from "../../services/logger.service.js"


export async function getToys(req, res) {
    try {
        const { filterBy, sortBy } = req.query

        // logger.debug('Getting Toys', filterBy)
        const toys = await toyService.query(filterBy, sortBy)

        res.json(toys)

    } catch (err) {
        logger.error('Cannot get toys', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function getById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function removeToy(req, res) {
    try {
        const { toyId } = req.params
        await toyService.remove(toyId)
        logger.info(`Toy ${toyId} removed`)
        res.send()
    } catch (err) {
        logger.error('Cannot remove item', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const toy = req.body
        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function addToy(req, res) {
    const { loggedinUser } = req

    try {
        const toy = req.body
        toy.owner = loggedinUser
        const addedToy = await toyService.add(toy)
        res.json(addedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}