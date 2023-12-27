import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { mapService } from './services/map.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174',
    ],
    credentials: true
}

// app.use(cors(corsOptions))
// app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve('public/index.html')))
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:8080',
            'http://localhost:8080',
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://127.0.0.1:5174',
            'http://localhost:5174',],
        credentials: true
    }
    app.use(cors(corsOptions))
}

app.get('/api/toy', (req, res) => {
    console.log('hellooooo');
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


// app.get('/api/toy', (req, res) => {
//     // const filterBy = {
//     //     txt: req.query.txt || '',
//     //     maxPrice: +req.query.maxPrice || 0,
//     // }

//     const filterBy = {}

//     if (req.query.txt) {
//         filterBy.txt = req.query.txt;
//     }

//     if (req.query.maxPrice) {
//         filterBy.maxPrice = +req.query.maxPrice;
//     }



//     toyService.query(filterBy)
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
        createdAt: Date.now(),
        inStock: req.body.inStock || 'all',
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
        inStock: req.body.inStock,
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
