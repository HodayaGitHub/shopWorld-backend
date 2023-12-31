import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import {getToys, getById, removeToy, updateToy, addToy}  from './toy.controller.js'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)
toyRoutes.post('/', addToy)
toyRoutes.get('/:id', getById)

// admin required:
toyRoutes.put('/', requireAdmin, updateToy)
toyRoutes.delete('/:toyId', requireAdmin, removeToy)


// toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
// toyRoutes.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)


// toyRoutes.put('/', updateToy)
// toyRoutes.post('/', requireAuth, addToy)
// toyRoutes.delete('/:id', removeToy)
