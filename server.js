const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.get('/', (req, res, next) => {
    res.send('Hello world!');
});

const main = () => {
    app.listen(PORT, () => console.log(`Server up and running at http://localhost:${PORT}`));
};

main();
