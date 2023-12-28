import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import {getToys, getById, removeToy, updateToy}  from './toy.controller.js'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)
toyRoutes.put('/', updateToy)
toyRoutes.get('/:id', getById)
toyRoutes.delete('/:id', removeToy)



// TODO: Uncomment these routes after creating a users and auth
// toyRoutes.post('/', requireAuth, addToy)
// toyRoutes.put('/:id', requireAuth, updateToy)
// toyRoutes.delete('/:id', requireAuth, removeToy)

// toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
// toyRoutes.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)