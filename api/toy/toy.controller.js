import { toyService } from "./toy.service.js"
import { loggerService } from "../../services/logger.service.js"


export async function getToys(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            maxPrice: +req.query.maxPrice || 0,
        }

        loggerService.debug('Getting Toys', filterBy)
        const toys = await toyService.query(filterBy)
        // console.log('Received toys:', toys)
        res.json(toys)

    } catch (err) {
        loggerService.error('Cannot get toys', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

