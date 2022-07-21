require('dotenv-flow').config();
const express = require('express')
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { typeDefs, resolvers } = require('./graphql')
const app = express()
const port = process.env.GRAPHQL_PORT || 4001

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Entrypoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema: executableSchema,
    context: {},
    graphiql: true,
  })
)


app.listen(port, () => {
  console.log(`Graphql Running a server at http://localhost:${port}`)
})