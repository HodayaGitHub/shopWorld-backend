import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/toy', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        maxPrice: +req.query.maxPrice || 0,
    }
    toyService.query(filterBy)
        .then((items) => {
            res.send(items)
        })
        .catch((err) => {
            loggerService.error('Cannot get items', err)
            res.status(400).send('Cannot get items')
        })
})


// Toy READ
app.get('/api/toy/:itemId', (req, res) => {
    const { itemId } = req.params
    toyService.getById(itemId)
        .then((item) => {
            res.send(item)
        })
        .catch((err) => {
            loggerService.error('Cannot get item', err)
            res.status(400).send('Cannot get item')
        })
})

// Toy CREATE
app.post('/api/toy', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add item')

    const item = {
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels || [],
        createdAt: Date.now(),
        inStock: req.body.inStock || 'all',
    }

    toyService.save(item, loggedinUser)
        .then((savedItem) => {
            res.send(savedItem)
        })
        .catch((err) => {
            loggerService.error('Cannot save item', err)
            res.status(400).send('Cannot save item')
        })
})


// toy UPDATE
app.put('/api/toy', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update item')
    const item = {
        _id: req.body._id,
        vendor: req.body.vendor,
        speed: +req.body.speed,
        price: +req.body.price,
    }
    toyService.save(item, loggedinUser)
        .then((savedItem) => {
            res.send(savedItem)
        })
        .catch((err) => {
            loggerService.error('Cannot save item', err)
            res.status(400).send('Cannot save item')
        })

})


// toy DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    loggerService.info('loggedinUser item delete:', loggedinUser)
    if (!loggedinUser) {
        loggerService.info('Cannot remove item, No user')
        return res.status(401).send('Cannot remove item')
    }

    const { itemId } = req.params
    itemService.remove(itemId, loggedinUser)
        .then(() => {
            loggerService.info(`item ${itemId} removed`)
            res.send('Removed!')
        })
        .catch((err) => {
            loggerService.error('Cannot remove item', err)
            res.status(400).send('Cannot remove item')
        })

})


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
