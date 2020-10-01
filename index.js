const { ApolloServer, gql } = require('apollo-server');

const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const conectDB = require('./config/db')

// conect to Data Base
conectDB();

const server = new ApolloServer({ typeDefs, resolvers });;

server.listen().then(({ url }) => {
    console.log(`Server ready in the URL: ${url}`)
});