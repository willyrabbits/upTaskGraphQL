const User = require('../models/Usuario')
const Project = require('../models/Project')
const Task = require('../models/Task')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })

// create and sign a token
const createToken = (user, secretword, expiresIn) => {
    const { id, name, email } = user
    return jwt.sign({ id, name, email }, secretword, { expiresIn })
}

const resolvers = {
    Query: {
        getProjects: async (_, { }, context) => {
            const projects = await Project.find({ creador: context.user.id })
            return projects
        },
        getTasks: async (_, { input }, context) => {
            const tasks = await Task.find({ creator: context.user.id }).where('project').equals(input.project)
            return tasks
        }
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

                return "User created correctly"
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
                token: createToken(existingUser, process.env.SECRET, '4hr')
            }
        },

        newProject: async (_, { input }, context) => {
            try {
                const project = new Project(input)

                // asociate creator
                project.creador = context.user.id

                // store in DB
                const result = await project.save()
                return result
            } catch (error) {
                console.log(error)
            }
        },
        updateProject: async (_, { id, input }, context) => {
            // check if project exists
            let project = await Project.findById(id)
            if (!project) {
                throw new Error('Project not found!')
            }

            // verify that user == creator
            if (project.creador.toString() !== context.user.id) {
                throw new Error('You can not modify a project if you hve not created it')
            }

            // update project
            project = await Project.findByIdAndUpdate({ _id: id }, input, { new: true })
            return project
        },
        deleteProject: async (_, { id }, context) => {
            // check if project exists
            let project = await Project.findById(id)
            if (!project) {
                throw new Error('Project not found!')
            }

            // verify that user == creator
            if (project.creador.toString() !== context.user.id) {
                throw new Error('You con not delete a project if you hve not created it')
            }

            // delete project
            await Project.findByIdAndDelete({ _id: id })
            return "Project deleted propertly"
        },

        newTask: async (_, { input }, context) => {
            try {
                const task = new Task(input)

                // asociate creator
                task.creator = context.user.id

                // store in DB
                const result = await task.save()
                return result
            } catch (error) {
                console.log(error)
            }
        },
        updateTask: async (_, { id, input, state }, context) => {
            // check if task exists
            let task = await Task.findById(id)
            if (!task) {
                throw new Error('Task not found!')
            }

            // verify that user == creator
            if (task.creator.toString() !== context.user.id) {
                throw new Error('You con not modify a task if you have not created it')
            }

            // set state
            input.state = state

            // update task
            task = await Task.findByIdAndUpdate({ _id: id }, input, { new: true })
            return task
        },
        deleteTask: async (_, { id }, context) => {
            // check if task exists
            let task = await Task.findById(id)
            if (!task) {
                throw new Error('Task not found!')
            }

            // verify that user == creator
            if (task.creator.toString() !== context.user.id) {
                throw new Error('You can not delete a task if you hve not created it')
            }

            // delete task
            await Task.findByIdAndDelete({ _id: id })
            return "Task deleted propertly"
        }

    }
}

module.exports = resolvers;