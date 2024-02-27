import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'
import { log } from '../../middlewares/logger.middleware.js'

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken
}

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) throw new Error('user error: Invalid username or password')
    const match = await bcrypt.compare(password.trim(), user.password.trim())

    if (!match) throw new Error('matching error: Invalid username or password')

    delete user.password
    return user
}

async function signup(username, fullname, password, email, isAdmin ) {
    const saltRounds = 10

    logger.debug(`auth.service - 
    signup with username: ${username},
     fullname: ${fullname}
     email:${email} `)
    if (!username || !password || !fullname || !email) throw new Error('Missing details')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname, isAdmin, email})
}

function getLoginToken(user) {
    const userInfo = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
        email: user.email,
    }
    return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}