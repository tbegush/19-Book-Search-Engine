const { ApolloServer, gql } = require('apollo-server-express');
const {authMiddleware} = require('./utils/auth');
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const {typeDefs, resolvers} = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

 //Create an instance of Apollo Server
const server = new ApolloServer({ typeDefs, resolvers, context: authMiddleware  });

//Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
