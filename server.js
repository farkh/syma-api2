const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');

const graphQLSchema = require('./graphql/schema/schema');
const graphQLResolvers = require('./graphql/resolvers');

const { connectDB } = require('./config/db');
const isAuth = require('./middleware/isAuth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(isAuth);

app.use(
    '/api',
    expressGraphQL({
        schema: graphQLSchema,
        rootValue: graphQLResolvers,
        graphiql: true,
    }),
);

const main = () => {
    connectDB();
    app.listen(PORT, () => console.log(`Server up and running at http://localhost:${PORT}`));
};

main();
