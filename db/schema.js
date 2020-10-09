const { gql } = require('apollo-server');

const typeDefs = gql`

    input UserInput {
        name: String!
        email: String!
        password: String!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    type Token {
        token: String
    }

    type Project {
        name: String
        id: ID
    }

    input ProjectInput {
        name: String!
    }

    input TaskInput {
        name: String!
        project: String
    }

    type Task {
        name: String
        id: ID
        project: String
        state: Boolean
    }

    input ProjectIDInput {
        project: String!
    }

    type Query {
        getProjects: [Project]
        getTasks(input: ProjectIDInput): [Task]
    }

    type Mutation {
        # Users
        createUser(input: UserInput): String
        authUser(input: AuthInput): Token
        
        # Projects
        newProject(input: ProjectInput): Project
        updateProject(id: ID!, input: ProjectInput): Project
        deleteProject(id: ID!): String

        # Tasks
        newTask(input: TaskInput): Task
        updateTask(id: ID!, input: TaskInput, state: Boolean): Task
        deleteTask(id: ID!): String

    }

`;

module.exports = typeDefs;