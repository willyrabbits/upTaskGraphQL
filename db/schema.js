const { gql } = require('apollo-server');

const typeDefs = gql`

    type Query {
        dummy: Boolean
    }

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

    type Mutation {
        createUser(input: UserInput): String
        authUser(input: AuthInput): Token
    }

`;

module.exports = typeDefs;