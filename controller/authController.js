const authModel = require('../models/authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    
    const { email, password } = req.body
    
    if (!email) {
        return res.status(404).json({ message: 'Please provide your email' })
    }
    if (!password) {
        return res.status(404).json({ message: 'Please provide your password' })
    }

    try {
        const user = await authModel.findOne({ email })

        if (user) {
            const match = await bcrypt.compare(password, user.password)
            if (match) {
                const obj = {
                    id: user.id,
                    name: user.name,
                }
                const token = await jwt.sign(obj, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })
                return res.status(200).json({ message: 'login success', token })
            } else {
                return res.status(404).json({ message: 'invalid password' })
            }
        } else {
            return res.status(404).json({ message: 'User not found' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'internal server error' })
    }
}

module.exports = {
    login,
}
