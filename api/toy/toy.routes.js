import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import {getToys} from './toy.controller.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', getToys)
