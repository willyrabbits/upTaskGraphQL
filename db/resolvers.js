const User = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })

// create and sign a token
const createToken = (user, secretword, expiresIn) => {
    const { id, email } = user
    return jwt.sign({ id, email }, secretword, { expiresIn })
}

const resolvers = {
    Query: {

    },
    Mutation: {
        createUser: async (root, { input }, context) => {
            const { email, password } = input

            // check if user exists
            const userExist = await User.findOne({ email })
            if (userExist) {
                throw new Error('User already exist')
            }

            try {
                // hash password 
                const salt = await bcryptjs.genSalt(10)
                input.password = await bcryptjs.hash(password, salt)

                // store new useer
                const newUser = new User(input)
                newUser.save()

                return "user created correctly"
            } catch (error) {
                console.log(error)
            }
        },

        authUser: async (root, { input }, context) => {
            const { email, password } = input

            // check if user exists
            const existingUser = await User.findOne({ email })
            if (!existingUser) {
                throw new Error('User does NOT exist')
            }

            // check if password is ok
            const passwordCorrect = await bcryptjs.compare(password, existingUser.password)
            if (!passwordCorrect) {
                throw new Error('Password does NOT match')
            }

            // give access to app
            return {
                token: createToken(existingUser, process.env.SECRET, '2hr')
            }
        }
    }
}

module.exports = resolvers;