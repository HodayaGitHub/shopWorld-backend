import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// TODO: delete these when refactoring is done
import { toyService } from './api/toy/toy.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { mapService } from './services/map.service.js'

const app = express()


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:27017'],
        credentials: true
    }
    app.use(cors(corsOptions))
}


// Express App Config
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())



import { toyRoutes } from './api/toy/toy.routes.js'
app.use('/api/toy', toyRoutes)


// app.get('/api/toy', (req, res) => {
//     // const filterBy = {
//     //     txt: req.query.txt || '',
//     //     maxPrice: +req.query.maxPrice || 0,
//     // }
//     toyService.query()
//         .then((items) => {
//             res.send(items)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot get items', err)
//             res.status(400).send('Cannot get items')
//         })
// })

// Toy READ

// app.get('/api/toy/alltoys', (req, res) => {
//     toyService.queryAll()
//         .then((items) => {
//             // console.log(items);
//             res.send(items)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot get items', err)
//             res.status(400).send('Cannot get items')
//         })
// })

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
    const item = {
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels || [],
        inStock: req.body.inStock || 'all',
        createdAt: Date.now(),
    }

    toyService.save(item)
        .then((savedItem) => {
            res.send(savedItem)
        })
        .catch((err) => {
            loggerService.error('Cannot save item', err)
            res.status(400).send('Cannot save item')
        })
})

// toy UPDATE
app.put('/api/toy/', (req, res) => {
    const item = {
        _id: req.body._id,
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels,
        inStock: req.body.inStock,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
    }

    toyService.save(item)
        .then((savedItem) => {
            // console.log('item', item)
            res.send(savedItem)
        })
        .catch((err) => {
            loggerService.error('Cannot save item', err)
            res.status(400).send('Cannot save item')
        })

})


// toy DELETE
app.delete('/api/toy/:itemId', (req, res) => {
    const { itemId } = req.params
    toyService.remove(itemId)
        .then(() => {
            loggerService.info(`item ${itemId} removed`)
            res.send('Removed!')
        })
        .catch((err) => {
            loggerService.error('Cannot remove item', err)
            res.status(400).send('Cannot remove item')
        })

})


// Map api
app.get('/api/map', (req, res) => {
    mapService.queryMap()
        .then((mapData) => {
            res.json(mapData)
        })
        .catch((error) => {
            console.error('Error fetching map data:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const port = process.env.PORT || 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
