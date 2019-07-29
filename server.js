const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');

const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use(
    '/api',
    expressGraphQL({
        schema: {},
        rootValue: {},
        graphiql: true,
    }),
);

const main = () => {
    connectDB();
    app.listen(PORT, () => console.log(`Server up and running at http://localhost:${PORT}`));
};

main();
